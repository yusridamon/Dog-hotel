const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 }),
  ],
  authController.login
);

router.get('/me', authenticateAdmin, authController.getMe);

module.exports = router;
