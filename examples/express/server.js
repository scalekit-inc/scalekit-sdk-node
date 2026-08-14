require('dotenv').config();

const express = require('express');
const ScalekitClient = require('@scalekit-sdk/node').default;
const { ScalekitAuth } = require('@scalekit-sdk/node/express');

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

function hasSessionCookie(req) {
  const cookieHeader = req.headers.cookie || '';
  return cookieHeader
    .split(';')
    .some((c) => c.trim().startsWith(`${auth.manager.cookieName}=`));
}

app.get('/', (req, res) => {
  res.send(
    hasSessionCookie(req)
      ? '<a href="/account">Account</a> | <a href="/logout">Logout</a>'
      : '<a href="/login">Login</a>'
  );
});

app.get('/account', auth.requiresAuth, (req, res) => {
  res.json({ user: req.scalekitUser });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
