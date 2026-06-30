const nodemailer = require('nodemailer');

const RECIPIENTS = [
  'legendenterprises@me.com',
  'jabookiebrown@gmail.com',
];

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      name = '',
      email = '',
      phone = '',
      eventDate = '',
      eventLocation = '',
      stageTime = '',
      comedianCount = '',
      budget = '',
      message = '',
    } = data;

    if (!name || !email || !stageTime || !budget) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const html = `
      <h2>New Booking Inquiry — Major Standup</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
      <p><strong>Event Location / Venue:</strong> ${eventLocation || 'Not provided'}</p>
      <p><strong>Stage Time Requested:</strong> ${stageTime}</p>
      <p><strong># of Comedians on Show:</strong> ${comedianCount || 'Not provided'}</p>
      <p><strong>Offer:</strong> ${budget}</p>
      <p><strong>Message:</strong> ${message || 'None'}</p>
    `;

    await transporter.sendMail({
      from: `"Major Standup Booking" <${process.env.GMAIL_USER}>`,
      to: RECIPIENTS.join(', '),
      subject: `New Booking Inquiry: ${name}`,
      html,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('booking-inquiry error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
