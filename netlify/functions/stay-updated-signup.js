// Lightweight email-only signup (footer "Stay Updated" widget).
// Adds the contact to Brevo Show Updates list (#15). API key stays server-side.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const { email = '' } = JSON.parse(event.body || '{}');
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing email' }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const SHOW_UPDATES_LIST = 15;

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [SHOW_UPDATES_LIST],
        updateEnabled: true,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error('Brevo stay-updated signup failed:', brevoRes.status, errText);
      return { statusCode: 502, body: JSON.stringify({ success: false, error: 'Brevo error' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('stay-updated-signup error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
