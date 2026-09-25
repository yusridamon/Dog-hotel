const prisma = require('../lib/prisma');
const { findAvailableKennels } = require('../utils/kennels');

// ─── Dashboard ───────────────────────────────────────────────────────────────

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue,
      unreadMessages,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({
        where: { checkInDate: { gte: today, lt: tomorrow }, status: { in: ['CONFIRMED', 'PENDING'] } },
      }),
      prisma.booking.count({
        where: { checkOutDate: { gte: today, lt: tomorrow }, status: { in: ['CONFIRMED'] } },
      }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { fullName: true, email: true } }, dogs: true },
      }),
    ]);

    res.json({
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        todayCheckIns,
        todayCheckOuts,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        unreadMessages,
      },
      recentBookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Bookings ────────────────────────────────────────────────────────────────

const getAllBookings = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { referenceNumber: { contains: search, mode: 'insensitive' } },
      { customer: { fullName: { contains: search, mode: 'insensitive' } } },
      { customer: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  try {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { fullName: true, email: true, phone: true } },
          dogs: true,
          kennels: { select: { name: true } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        dogs: true,
        kennels: true,
      },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const bookingId = parseInt(req.params.id);
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { kennels: true },
    });
    if (!existing) return res.status(404).json({ error: 'Booking not found' });

    const data = { status };

    if (status === 'CONFIRMED') {
      // Ensure enough kennels are assigned (one per dog).
      const alreadyAssigned = existing.kennels.length;
      const needed = existing.numberOfDogs - alreadyAssigned;
      if (needed > 0) {
        const free = await findAvailableKennels(existing.checkInDate, existing.checkOutDate, needed, bookingId);
        if (free.length < needed) {
          return res.status(409).json({
            error: `Cannot confirm — need ${existing.numberOfDogs} kennel${existing.numberOfDogs === 1 ? '' : 's'} but only ${alreadyAssigned + free.length} available for these dates.`,
            fullyBooked: true,
          });
        }
        data.kennels = { connect: free.map((k) => ({ id: k.id })) };
      }
    } else if (status === 'REJECTED' || status === 'CANCELLED') {
      // Free up all kennels so they can be re-used
      data.kennels = { set: [] };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
      include: { customer: true, dogs: true, kennels: true },
    });
    res.json(booking);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Booking not found' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Set/enter a custom total price for a booking (used mainly to fill in a
// manual quote for stays that require one). Entering a price clears the
// requiresQuote flag so the booking is no longer flagged as awaiting a quote.
const updateBookingPrice = async (req, res) => {
  const { totalPrice } = req.body;
  const price = Number(totalPrice);

  if (!Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: 'A valid total price is required' });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { totalPrice: price, requiresQuote: false },
      include: { customer: true, dogs: true, kennels: true },
    });
    res.json(booking);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Booking not found' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await prisma.booking.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Booking not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Upcoming ────────────────────────────────────────────────────────────────

const getUpcomingCheckIns = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        checkInDate: { gte: today, lte: nextWeek },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      orderBy: { checkInDate: 'asc' },
      include: { customer: { select: { fullName: true, phone: true } }, dogs: true, kennels: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUpcomingCheckOuts = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        checkOutDate: { gte: today, lte: nextWeek },
        status: 'CONFIRMED',
      },
      orderBy: { checkOutDate: 'asc' },
      include: { customer: { select: { fullName: true, phone: true } }, dogs: true, kennels: true },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Kennels ─────────────────────────────────────────────────────────────────

const getAllKennels = async (req, res) => {
  try {
    const kennels = await prisma.kennel.findMany({
      orderBy: { name: 'asc' },
      include: {
        bookings: {
          where: { status: { in: ['CONFIRMED', 'PENDING'] } },
          select: { id: true, checkInDate: true, checkOutDate: true, status: true, customer: { select: { fullName: true } } },
        },
      },
    });
    res.json(kennels);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createKennel = async (req, res) => {
  const { name, description, size } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const kennel = await prisma.kennel.create({ data: { name, description, size: size || 'STANDARD' } });
    res.status(201).json(kennel);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateKennel = async (req, res) => {
  const { name, description, size, isActive } = req.body;
  try {
    const kennel = await prisma.kennel.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, size, isActive },
    });
    res.json(kennel);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Kennel not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteKennel = async (req, res) => {
  try {
    await prisma.kennel.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Kennel deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Kennel not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

const getKennelAvailability = async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) {
    return res.status(400).json({ error: 'checkIn and checkOut dates required' });
  }

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find kennels occupied by overlapping confirmed/pending bookings
    const overlapping = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkInDate: { lt: checkOutDate },
        checkOutDate: { gt: checkInDate },
      },
      select: { kennels: { select: { id: true } } },
    });

    const occupiedIds = new Set();
    overlapping.forEach((b) => b.kennels.forEach((k) => occupiedIds.add(k.id)));

    const kennels = await prisma.kennel.findMany({
      where: { isActive: true },
    });
    kennels.sort((a, b) => Number(a.name) - Number(b.name));

    const kennelsWithAvailability = kennels.map((k) => ({
      ...k,
      isAvailable: !occupiedIds.has(k.id),
    }));

    res.json(kennelsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a specific kennel to a booking (staff manual override).
// action: 'add' (default) or 'remove'
const assignKennel = async (req, res) => {
  const { bookingId, action } = req.body;
  const kennelId = parseInt(req.params.id);
  const bId = parseInt(bookingId);

  try {
    const booking = await prisma.booking.findUnique({ where: { id: bId }, include: { kennels: true } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (action === 'remove') {
      const updated = await prisma.booking.update({
        where: { id: bId },
        data: { kennels: { disconnect: { id: kennelId } } },
        include: { kennels: true },
      });
      return res.json(updated);
    }

    // Adding: make sure this kennel isn't already taken by another active
    // booking that overlaps these dates.
    const clash = await prisma.booking.findFirst({
      where: {
        id: { not: bId },
        kennels: { some: { id: kennelId } },
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkInDate: { lt: booking.checkOutDate },
        checkOutDate: { gt: booking.checkInDate },
      },
      include: { customer: { select: { fullName: true } } },
    });

    if (clash) {
      return res.status(409).json({
        error: `Kennel is already occupied for these dates by ${clash.customer.fullName} (${clash.referenceNumber}).`,
      });
    }

    const updated = await prisma.booking.update({
      where: { id: bId },
      data: { kennels: { connect: { id: kennelId } } },
      include: { kennels: true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Customers ───────────────────────────────────────────────────────────────

const getAllCustomers = async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { bookings: true } } },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      customers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: { dogs: true, kennels: { select: { name: true } } },
        },
      },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Calendar ────────────────────────────────────────────────────────────────

const getCalendarData = async (req, res) => {
  const { year, month } = req.query;
  const y = parseInt(year) || new Date().getFullYear();
  const m = parseInt(month) || new Date().getMonth() + 1;

  const startOfMonth = new Date(y, m - 1, 1);
  const endOfMonth = new Date(y, m, 0, 23, 59, 59);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { checkInDate: { gte: startOfMonth, lte: endOfMonth } },
          { checkOutDate: { gte: startOfMonth, lte: endOfMonth } },
          { checkInDate: { lte: startOfMonth }, checkOutDate: { gte: endOfMonth } },
        ],
      },
      include: {
        customer: { select: { fullName: true } },
        dogs: { select: { name: true } },
      },
    });

    const events = bookings.map((b) => ({
      id: b.id,
      title: `${b.customer.fullName} (${b.numberOfDogs} dog${b.numberOfDogs > 1 ? 's' : ''})`,
      start: b.checkInDate,
      end: b.checkOutDate,
      status: b.status,
      referenceNumber: b.referenceNumber,
      dogs: b.dogs.map((d) => d.name).join(', '),
    }));

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ─── Messages ────────────────────────────────────────────────────────────────

const getAllMessages = async (req, res) => {
  const { unread } = req.query;
  const where = unread === 'true' ? { isRead: false } : {};

  try {
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const msg = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true },
    });
    res.json(msg);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Message not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Message not found' });
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getAllBookings, getBookingById, updateBookingStatus, updateBookingPrice, deleteBooking,
  getUpcomingCheckIns, getUpcomingCheckOuts,
  getAllKennels, createKennel, updateKennel, deleteKennel, getKennelAvailability, assignKennel,
  getAllCustomers, getCustomerById,
  getCalendarData,
  getAllMessages, markMessageRead, deleteMessage,
};
