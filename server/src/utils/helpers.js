const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique booking reference number
 * Format: DH-YYYYMMDD-XXXX (DH = Dog Hotel)
 */
const generateReferenceNumber = () => {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DH-${dateStr}-${random}`;
};

/**
 * Calculate number of nights between two dates
 */
const calculateNights = (checkIn, checkOut) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return Math.round((checkOutDate - checkInDate) / msPerDay);
};

/**
 * Calculate total price
 */
const calculatePrice = (nights, numberOfDogs, pricePerNight) => {
  return nights * numberOfDogs * pricePerNight;
};

module.exports = {
  generateReferenceNumber,
  calculateNights,
  calculatePrice,
};
