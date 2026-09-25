const prisma = require('../lib/prisma');

const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getFacilities = async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getPricing = async (req, res) => {
  res.json({
    pricePerDogPerNight: parseFloat(process.env.PRICE_PER_DOG_PER_NIGHT) || 250,
    currency: 'ZAR',
    currencySymbol: 'R',
    // Stays longer than this many nights are priced separately via a manual quote.
    quoteThresholdNights: 10,
  });
};

module.exports = { getServices, getFacilities, getPricing };
