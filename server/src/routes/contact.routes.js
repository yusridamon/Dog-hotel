const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').optional().trim(),
    body('subject').notEmpty().trim().isLength({ min: 3, max: 150 }),
    body('message').notEmpty().trim().isLength({ min: 10, max: 2000 }),
  ],
  contactController.submitMessage
);

module.exports = router;
