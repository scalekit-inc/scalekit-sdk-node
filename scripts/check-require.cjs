// Checks that the committed CommonJS build loads with require() on the Node.js
// version running this script, and that the jose it loads can verify a token.
//
// Usage (from the repository root, after `npm ci` and `npm run build`):
//   node scripts/check-require.cjs
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));

function errorCode(error) {
  return typeof error === 'object' && error !== null ? error.code : undefined;
}

// Whether this Node.js version can require() the installed (ES module) jose.
let installedJose;
try {
  installedJose = require('jose');
} catch (error) {
  if (errorCode(error) !== 'ERR_REQUIRE_ESM') throw error;
}
const requireEsm = installedJose !== undefined;

// `./edge` imports jose directly: it targets runtimes that always bundle it
// (Edge Runtime, middleware), so it is loaded only where require(esm) works.
const needsRequireEsm = new Set(['./edge']);

async function main() {
  console.log(
    `Node.js ${process.version}; require(esm) ${requireEsm ? 'available' : 'unavailable'}`
  );

  for (const [entry, target] of Object.entries(pkg.exports)) {
    if (!requireEsm && needsRequireEsm.has(entry)) {
      console.log(`skip ${entry} (loads jose directly; bundled runtimes only)`);
      continue;
    }
    const file = path.join(root, target.default);
    const mod = require(file);
    assert.ok(Object.keys(mod).length > 0, `${entry} has no exports`);
    console.log(`ok   require('${entry}') -> ${target.default}`);
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

  // Sign a token, then validate it through the SDK client with the public key.
  const signer = installedJose || bundled;
  const { publicKey, privateKey } = await signer.generateKeyPair('RS256', {
    extractable: true,
  });
  const jwk = {
    ...(await signer.exportJWK(publicKey)),
    kid: 'k1',
    alg: 'RS256',
  };
  const issuer = 'https://example.scalekit.dev';
  const token = await new signer.SignJWT({
    scopes: ['read', 'write'],
    sub: 'usr_1',
  })
    .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
    .setIssuer(issuer)
    .setAudience('aud_1')
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey);

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
  assert.equal(loaded.decodeJwt(token).sub, 'usr_1');

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
