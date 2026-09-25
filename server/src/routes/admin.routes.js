const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// Dashboard stats
router.get('/dashboard', adminController.getDashboard);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingById);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);
router.patch('/bookings/:id/price', adminController.updateBookingPrice);
router.delete('/bookings/:id', adminController.deleteBooking);

// Upcoming check-ins/check-outs
router.get('/upcoming/checkins', adminController.getUpcomingCheckIns);
router.get('/upcoming/checkouts', adminController.getUpcomingCheckOuts);

// Kennels
router.get('/kennels', adminController.getAllKennels);
router.post('/kennels', adminController.createKennel);
router.put('/kennels/:id', adminController.updateKennel);
router.delete('/kennels/:id', adminController.deleteKennel);
router.get('/kennels/availability', adminController.getKennelAvailability);
router.post('/kennels/:id/assign', adminController.assignKennel);

// Customers
router.get('/customers', adminController.getAllCustomers);
router.get('/customers/:id', adminController.getCustomerById);

// Calendar
router.get('/calendar', adminController.getCalendarData);

// Contact messages
router.get('/messages', adminController.getAllMessages);
router.patch('/messages/:id/read', adminController.markMessageRead);
router.delete('/messages/:id', adminController.deleteMessage);

module.exports = router;
