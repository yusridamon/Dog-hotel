const { validationResult } = require('express-validator');
const prisma = require('../lib/prisma');

const submitMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, subject, message } = req.body;

  try {
    const msg = await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, subject, message },
    });
    res.status(201).json({ message: 'Message sent successfully', id: msg.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = { submitMessage };
