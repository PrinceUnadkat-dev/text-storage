const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve your HTML/CSS/JS
app.use(express.static(path.join(__dirname)));

const SENDINBLUE_API_KEY = process.env.SENDINBLUE_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_NAME = process.env.SENDER_NAME || 'Text Storage App';

// ✅ Email route
app.post('/send-email', async (req, res) => {
  const { to_email, message } = req.body;
  if (!to_email || !message)
    return res.status(400).json({ error: 'Missing to_email or message' });

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: to_email }],
        subject: 'Shared Text from Text Storage',
        htmlContent: `<pre>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
      })
    });

    if (response.ok) {
      res.json({ success: true });
    } else {
      const error = await response.text();
      res.status(400).json({ error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running: http://localhost:${PORT}`));
