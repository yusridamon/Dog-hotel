const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendBookingConfirmation = async (booking, customer, dogs) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('Email not configured, skipping confirmation email.');
    return false;
  }

  const dogNames = dogs.map((d) => `${d.name} (${d.breed})`).join(', ');
  const checkIn = new Date(booking.checkInDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const checkOut = new Date(booking.checkOutDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #2d6a4f; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; }
        .ref-box { background: #2d6a4f; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .ref-box h2 { margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .ref-box p { margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 3px; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .details-table td:first-child { font-weight: bold; color: #555; width: 40%; }
        .footer { background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        .status-badge { display: inline-block; background: #f59e0b; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🐾 Doggo'tel</h1>
        <p>Your dog's happy place away from home</p>
      </div>
      <div class="content">
        <p>Dear ${customer.fullName},</p>
        <p>Thank you for booking with us! We have received your booking request and it is currently being reviewed. You will receive another email once your booking is confirmed.</p>
        
        <div class="ref-box">
          <h2>Your Booking Reference</h2>
          <p>${booking.referenceNumber}</p>
        </div>

        <p><strong>Status:</strong> <span class="status-badge">PENDING REVIEW</span></p>

        <table class="details-table">
          <tr><td>Guest Name</td><td>${customer.fullName}</td></tr>
          <tr><td>Email</td><td>${customer.email}</td></tr>
          <tr><td>Phone</td><td>${customer.phone}</td></tr>
          <tr><td>Dogs</td><td>${dogNames}</td></tr>
          <tr><td>Number of Dogs</td><td>${booking.numberOfDogs}</td></tr>
          <tr><td>Check-In</td><td>${checkIn}</td></tr>
          <tr><td>Check-Out</td><td>${checkOut}</td></tr>
          <tr><td>Duration</td><td>${booking.numberOfNights} night${booking.numberOfNights !== 1 ? 's' : ''}</td></tr>
          ${booking.requiresQuote
            ? `<tr><td>Estimated Total</td><td><strong>We'll send you a personalised quote</strong></td></tr>`
            : `<tr><td>Estimated Total</td><td><strong>R${booking.totalPrice.toFixed(2)}</strong></td></tr>`}
        </table>

        ${booking.requiresQuote
          ? `<p style="background:#f0f9e4;border:1px solid #cfe3a6;border-radius:8px;padding:14px 18px;color:#3a4a1a;">Because your stay is longer than 10 nights, it is priced separately. We'll review the dates and send you a personalised quote shortly.</p>`
          : ''}

        <p>Please keep your reference number safe. You can use it to enquire about your booking by contacting us.</p>
        <p>If you have any questions, please don't hesitate to get in touch.</p>
        <p>Warm regards,<br><strong>Yusri & the Doggo'tel Team</strong></p>
      </div>
      <div class="footer">
        <p>Doggo'tel | doggotel.cpt@gmail.com | 066 291 5804 | Schaapkraal, Cape Town</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Dog Hotel <noreply@doghotel.com>',
      to: customer.email,
      subject: `Booking Received - ${booking.referenceNumber} | Doggo'tel`,
      html,
    });
    return true;
  } catch (err) {
    console.error('Failed to send email:', err.message);
    return false;
  }
};

module.exports = { sendBookingConfirmation };
