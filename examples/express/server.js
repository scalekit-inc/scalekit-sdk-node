require('dotenv').config();

const express = require('express');
const ScalekitClient = require('@scalekit-sdk/node').default;
const { ScalekitAuth } = require('@scalekit-sdk/node/lib/frameworks/express');

const client = new ScalekitClient(
  process.env.SCALEKIT_ENVIRONMENT_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);

const auth = new ScalekitAuth({
  client,
  redirectUri: process.env.REDIRECT_URI,
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET,
});

const app = express();
app.use(auth.router);

app.get('/', (_req, res) => {
  res.send(
    '<a href="/login">Login</a> | <a href="/account">Account</a> | <a href="/logout">Logout</a>'
  );
});

app.get('/account', auth.requiresAuth, (req, res) => {
  res.json({ user: req.scalekitUser });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
