// Checks that the committed CommonJS build loads with require() on the Node.js
// version running this script, and that the jose it loads can verify a token.
//
// Usage (from the repository root, after `npm ci` and `npm run build`):
//   node scripts/check-require.cjs
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));

// Whether this Node.js can require() the installed (ES module) jose.
let installedJose;
try {
  installedJose = require('jose');
} catch (error) {
  if (error?.code !== 'ERR_REQUIRE_ESM') throw error;
}
const requireEsm = installedJose !== undefined;

async function main() {
  console.log(
    `Node.js ${process.version}; require(esm) ${requireEsm ? 'available' : 'unavailable'}`
  );

  for (const [entry, target] of Object.entries(pkg.exports)) {
    // `./edge` imports jose directly: it targets runtimes that always bundle
    // it (Edge Runtime, middleware), so it loads only where require(esm) works.
    if (!requireEsm && entry === './edge') {
      console.log(`skip ${entry} (loads jose directly; bundled runtimes only)`);
      continue;
    }
    const rel =
      typeof target === 'string' ? target : (target.require ?? target.default);
    const mod = require(path.join(root, rel));
    assert.ok(Object.keys(mod).length > 0, `${entry} has no exports`);
    console.log(`ok   require('${entry}') -> ${rel}`);
  }

  // The loader prefers the installed jose and falls back to the bundled copy
  // only where require(esm) is unavailable.
  const loaded = require(path.join(root, 'lib/vendor/jose'));
  const bundled = require(path.join(root, 'lib/vendor/jose.bundle.js'));
  const expected = requireEsm ? installedJose : bundled;
  for (const name of ['createLocalJWKSet', 'jwtVerify', 'decodeJwt']) {
    assert.equal(typeof loaded[name], 'function', `${name} is not exported`);
    assert.equal(
      loaded[name],
      expected[name],
      `${name} is from the wrong jose`
    );
  }
  console.log(
    `ok   lib/vendor/jose uses the ${requireEsm ? 'installed' : 'bundled'} jose`
  );

  // jose errors keep their class names in the bundled copy too.
  for (const jose of [loaded, bundled]) {
    assert.throws(() => jose.decodeJwt('not-a-jwt'), {
      name: 'JWTInvalid',
      code: 'ERR_JWT_INVALID',
    });
  }
  console.log('ok   jose errors keep their names');

  // Sign a token with node:crypto (no jose needed, so it works on every
  // Node.js version), then validate it through the SDK client.
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });
  const jwk = {
    ...publicKey.export({ format: 'jwk' }),
    kid: 'k1',
    alg: 'RS256',
  };
  const issuer = 'https://example.scalekit.dev';
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  const signingInput = `${encode({ alg: 'RS256', kid: 'k1', typ: 'JWT' })}.${encode(
    {
      scopes: ['read', 'write'],
      sub: 'usr_1',
      iss: issuer,
      aud: 'aud_1',
      iat: now,
      exp: now + 300,
    }
  )}`;
  const signature = crypto
    .sign('RSA-SHA256', Buffer.from(signingInput), privateKey)
    .toString('base64url');
  const token = `${signingInput}.${signature}`;

  const { ScalekitClient } = require(root);
  const client = new ScalekitClient(issuer, 'skc_1', 'secret');
  // Pre-load the signing keys so validateToken makes no network call.
  client.coreClient.keys = [jwk];
  const claims = await client.validateToken(token, {
    issuer,
    audience: ['aud_1'],
    requiredScopes: ['read'],
  });
  assert.equal(claims.sub, 'usr_1');

  // Change the first character of the signature segment.
  const sigStart = token.lastIndexOf('.') + 1;
  const flipped = token[sigStart] === 'A' ? 'B' : 'A';
  const tampered =
    token.slice(0, sigStart) + flipped + token.slice(sigStart + 1);
  await assert.rejects(client.validateToken(tampered), {
    name: 'ScalekitValidateTokenFailureException',
  });
  console.log(
    'ok   validateToken accepts a signed token and rejects a tampered one'
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
