const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');

const router = express.Router();

// Public - submit a booking (no auth required)
router.post(
  '/',
  [
    body('fullName').notEmpty().trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').notEmpty().trim().isLength({ min: 7, max: 20 }),
    body('dogs').isArray({ min: 1 }),
    body('dogs.*.name').notEmpty().trim(),
    body('dogs.*.breed').notEmpty().trim(),
    body('numberOfDogs').isInt({ min: 1, max: 20 }),
    body('checkInDate').isISO8601(),
    body('checkOutDate').isISO8601(),
  ],
  bookingController.createBooking
);

// Public - get booking by reference number
router.get('/reference/:ref', bookingController.getBookingByReference);

// Public - get price estimate
router.post('/estimate', bookingController.getEstimate);

// Public - check kennel availability for a date range
router.get('/availability', bookingController.checkAvailability);

module.exports = router;
