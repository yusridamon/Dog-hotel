const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const { generateReferenceNumber, calculateNights, calculatePrice } = require('../utils/helpers');
const { sendBookingConfirmation } = require('../utils/email');
const { findAvailableKennels, countAvailableKennels } = require('../utils/kennels');

const PRICE_PER_DOG_PER_NIGHT = parseFloat(process.env.PRICE_PER_DOG_PER_NIGHT) || 250;

// Stays longer than this many nights are priced separately via a manual quote
// rather than auto-calculated. Change this single constant to adjust the threshold.
const QUOTE_THRESHOLD_NIGHTS = 10;

const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName, email, phone,
    dogs, numberOfDogs,
    checkInDate, checkOutDate,
    feedingInstructions, medicalInfo,
    specialRequirements, additionalNotes,
  } = req.body;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    return res.status(400).json({ error: 'Check-in date cannot be in the past' });
  }
  if (checkOut <= checkIn) {
    return res.status(400).json({ error: 'Check-out must be after check-in' });
  }

  const nights = calculateNights(checkIn, checkOut);
  // Stays over the threshold are quoted manually by an admin, so we do not
  // auto-calculate a total. Shorter stays behave exactly as before.
  const requiresQuote = nights > QUOTE_THRESHOLD_NIGHTS;
  const totalPrice = requiresQuote ? 0 : calculatePrice(nights, numberOfDogs, PRICE_PER_DOG_PER_NIGHT);
  const referenceNumber = generateReferenceNumber();

  try {
    // Each dog needs its own kennel. Find N lowest-numbered free kennels.
    const freeKennels = await findAvailableKennels(checkIn, checkOut, numberOfDogs);
    if (freeKennels.length < numberOfDogs) {
      return res.status(409).json({
        error: `Sorry, we only have ${freeKennels.length} kennel${freeKennels.length === 1 ? '' : 's'} free for those dates, but you need ${numberOfDogs}. Please try different dates or contact us.`,
        fullyBooked: true,
        available: freeKennels.length,
        needed: numberOfDogs,
      });
    }

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: { email, phone },
    });
    if (!customer) {
      customer = await prisma.customer.create({
        data: { fullName, email, phone },
      });
    }

    // Create booking with dogs, connecting the N lowest-numbered free kennels
    const booking = await prisma.booking.create({
      data: {
        referenceNumber,
        customerId: customer.id,
        numberOfDogs,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfNights: nights,
        pricePerNight: PRICE_PER_DOG_PER_NIGHT,
        totalPrice,
        requiresQuote,
        feedingInstructions: feedingInstructions || null,
        medicalInfo: medicalInfo || null,
        specialRequirements: specialRequirements || null,
        additionalNotes: additionalNotes || null,
        kennels: {
          connect: freeKennels.map((k) => ({ id: k.id })),
        },
        dogs: {
          create: dogs.map((d) => ({ name: d.name, breed: d.breed })),
        },
      },
      include: { dogs: true, customer: true, kennels: true },
    });

    // Send confirmation email
    const emailSent = await sendBookingConfirmation(booking, customer, booking.dogs);
    if (emailSent) {
      await prisma.booking.update({ where: { id: booking.id }, data: { emailSent: true } });
    }

    res.status(201).json({
      message: 'Booking submitted successfully',
      referenceNumber: booking.referenceNumber,
      booking: {
        id: booking.id,
        referenceNumber: booking.referenceNumber,
        status: booking.status,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        numberOfNights: booking.numberOfNights,
        numberOfDogs: booking.numberOfDogs,
        totalPrice: booking.totalPrice,
        pricePerNight: booking.pricePerNight,
        requiresQuote: booking.requiresQuote,
        dogs: booking.dogs,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Public - check availability for a date range (optionally for N dogs)
const checkAvailability = async (req, res) => {
  const { checkInDate, checkOutDate, numberOfDogs } = req.query;
  if (!checkInDate || !checkOutDate) {
    return res.status(400).json({ error: 'checkInDate and checkOutDate are required' });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  if (checkOut <= checkIn) {
    return res.status(400).json({ error: 'Invalid date range' });
  }

  const needed = parseInt(numberOfDogs) || 1;

  try {
    const available = await countAvailableKennels(checkIn, checkOut);
    res.json({
      available,
      needed,
      isAvailable: available >= needed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookingByReference = async (req, res) => {
  const { ref } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { referenceNumber: ref.toUpperCase() },
      include: {
        customer: { select: { fullName: true, email: true, phone: true } },
        dogs: true,
        kennels: { select: { name: true } },
      },
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getEstimate = async (req, res) => {
  const { checkInDate, checkOutDate, numberOfDogs } = req.body;

  if (!checkInDate || !checkOutDate || !numberOfDogs) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const nights = calculateNights(new Date(checkInDate), new Date(checkOutDate));
  if (nights <= 0) {
    return res.status(400).json({ error: 'Invalid date range' });
  }

  // Stays over the threshold are quoted separately, so we do not return a total.
  if (nights > QUOTE_THRESHOLD_NIGHTS) {
    return res.json({
      nights,
      numberOfDogs,
      pricePerDogPerNight: PRICE_PER_DOG_PER_NIGHT,
      requiresQuote: true,
      quoteThresholdNights: QUOTE_THRESHOLD_NIGHTS,
    });
  }

  const total = calculatePrice(nights, numberOfDogs, PRICE_PER_DOG_PER_NIGHT);

  res.json({
    nights,
    numberOfDogs,
    pricePerDogPerNight: PRICE_PER_DOG_PER_NIGHT,
    requiresQuote: false,
    totalPrice: total,
  });
};

module.exports = { createBooking, getBookingByReference, getEstimate, checkAvailability };
