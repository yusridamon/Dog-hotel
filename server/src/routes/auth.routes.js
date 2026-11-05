const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.post(
  '/login',
  [
    // Do not normalizeEmail(): it strips dots from Gmail local parts
    // (e.g. doggotel.cpt@gmail.com -> doggotelcpt@gmail.com), which would not
    // match the stored address. Compare the email exactly as entered.
    body('email').isEmail(),
    body('password').notEmpty().isLength({ min: 6 }),
  ],
  authController.login
);

router.get('/me', authenticateAdmin, authController.getMe);

module.exports = router;
