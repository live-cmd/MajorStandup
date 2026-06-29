// Handles Open Mic sign-ups: writes to Supabase (for the live list display)
// AND adds the contact to Brevo (for email marketing). Brevo API key stays
// server-side — never exposed to the browser.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const {
      first_name = '',
      last_name = '',
      email = '',
      stage_name = '',
      phone = '',
      hometown = '',
      comedy_style = '',
      first_time = '',
      show_updates_optin = false,
    } = data;

    if (!email || !first_name || !last_name) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing required fields' }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const OPEN_MIC_LIST = 14;
    const SHOW_UPDATES_LIST = 15;

    const listIds = [OPEN_MIC_LIST];
    if (show_updates_optin) listIds.push(SHOW_UPDATES_LIST);

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        firstName: first_name,
        lastName: last_name,
        attributes: {
          STAGE_NAME: stage_name,
          PHONE: phone,
          HOMETOWN: hometown,
          COMEDY_STYLE: comedy_style,
          FIRST_TIME: first_time,
        },
        listIds,
        updateEnabled: true,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error('Brevo contact creation failed:', brevoRes.status, errText);
      // Don't fail the whole signup over a Brevo hiccup — the Supabase
      // insert (handled client-side) is what actually secures their spot.
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('open-mic-brevo-signup error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
