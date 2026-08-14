const { ScalekitEdgeClient } = require('@scalekit-sdk/node/edge');
const { ScalekitAuthNext } = require('@scalekit-sdk/node/next');

const client = new ScalekitEdgeClient(
  process.env.SCALEKIT_ENVIRONMENT_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);

const auth = new ScalekitAuthNext({
  client,
  redirectUri: process.env.REDIRECT_URI,
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET,
});

module.exports = { auth };
