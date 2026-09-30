import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  jest as jestGlobal,
} from '@jest/globals';
import * as jose from 'jose';
import ScalekitClient from '../src/scalekit';
import { ScalekitEdgeClient } from '../src/edge';

const ENV_URL = 'https://acme.scalekit.cloud';
const BASE_ISSUER = ENV_URL;
const RESOURCE_ISSUER = `${ENV_URL}/resources/res_123`;

describe('multi-issuer token validation', () => {
  let privateKey: Awaited<
    ReturnType<typeof jose.generateKeyPair>
  >['privateKey'];
  let publicJwk: jose.JWK;
  let client: ScalekitClient;
  let edgeClient: ScalekitEdgeClient;

  beforeAll(async () => {
    const { publicKey, privateKey: priv } = await jose.generateKeyPair('RS256');
    privateKey = priv;
    publicJwk = await jose.exportJWK(publicKey);
    publicJwk.kid = 'test-key-1';
    publicJwk.alg = 'RS256';
    publicJwk.use = 'sig';
  });

  beforeEach(() => {
    client = new ScalekitClient(ENV_URL, 'skc_123', 'secret');
    // Inject signing keys so CoreClient.getJwks() short-circuits without network
    (
      client as unknown as { coreClient: { keys: jose.JWK[] } }
    ).coreClient.keys = [publicJwk];

    edgeClient = new ScalekitEdgeClient(ENV_URL, 'skc_123', 'secret');
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ keys: [publicJwk] }),
    } as Response);
  });

  afterEach(() => {
    jestGlobal.restoreAllMocks();
  });

  const signWithIssuer = (iss: string) =>
    new jose.SignJWT({ sub: 'user_1' })
      .setProtectedHeader({ alg: 'RS256', kid: 'test-key-1' })
      .setIssuer(iss)
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);

  // Both clients must behave identically, so run the same matrix on each.
  const variants: Array<{
    name: string;
    validate: (token: string, issuer?: string | string[]) => Promise<unknown>;
    validateBool?: (
      token: string,
      issuer?: string | string[]
    ) => Promise<boolean>;
  }> = [
    {
      name: 'ScalekitClient',
      validate: (token, issuer) => client.validateToken(token, { issuer }),
      validateBool: (token, issuer) =>
        client.validateAccessToken(token, { issuer }),
    },
    {
      name: 'ScalekitEdgeClient',
      validate: (token, issuer) => edgeClient.validateToken(token, { issuer }),
    },
  ];

  describe.each(variants)('$name', ({ name, validate, validateBool }) => {
    it('accepts a single string issuer that matches', async () => {
      const token = await signWithIssuer(BASE_ISSUER);
      await expect(validate(token, BASE_ISSUER)).resolves.toMatchObject({
        sub: 'user_1',
      });
    });

    it('rejects a single string issuer that does not match', async () => {
      const token = await signWithIssuer(BASE_ISSUER);
      await expect(validate(token, RESOURCE_ISSUER)).rejects.toThrow();
    });

    it('accepts when the token issuer matches the 1st array entry', async () => {
      const token = await signWithIssuer(BASE_ISSUER);
      await expect(
        validate(token, [BASE_ISSUER, RESOURCE_ISSUER])
      ).resolves.toMatchObject({ sub: 'user_1' });
    });

    it('accepts when the token issuer matches the 2nd array entry', async () => {
      const token = await signWithIssuer(RESOURCE_ISSUER);
      await expect(
        validate(token, [BASE_ISSUER, RESOURCE_ISSUER])
      ).resolves.toMatchObject({ sub: 'user_1' });
    });

    it('rejects when the token issuer matches no array entry', async () => {
      const token = await signWithIssuer(`${ENV_URL}/resources/res_other`);
      await expect(
        validate(token, [BASE_ISSUER, RESOURCE_ISSUER])
      ).rejects.toThrow();
    });

    it('does not normalize trailing slashes (exact match only)', async () => {
      const token = await signWithIssuer(`${BASE_ISSUER}/`);
      await expect(validate(token, [BASE_ISSUER])).rejects.toThrow();
    });

    it('skips the issuer check when issuer is undefined', async () => {
      const token = await signWithIssuer(RESOURCE_ISSUER);
      await expect(validate(token, undefined)).resolves.toMatchObject({
        sub: 'user_1',
      });
    });

    it('skips the issuer check when issuer is an empty array', async () => {
      const token = await signWithIssuer(RESOURCE_ISSUER);
      await expect(validate(token, [])).resolves.toMatchObject({
        sub: 'user_1',
      });
    });

    it('skips the issuer check when issuer is an empty string', async () => {
      const token = await signWithIssuer(RESOURCE_ISSUER);
      await expect(validate(token, '')).resolves.toMatchObject({
        sub: 'user_1',
      });
    });

    if (validateBool) {
      it(`${name}.validateAccessToken returns true for any-of match`, async () => {
        const token = await signWithIssuer(RESOURCE_ISSUER);
        await expect(
          validateBool(token, [BASE_ISSUER, RESOURCE_ISSUER])
        ).resolves.toBe(true);
      });

      it(`${name}.validateAccessToken returns false when no issuer matches`, async () => {
        const token = await signWithIssuer(`${ENV_URL}/resources/res_other`);
        await expect(
          validateBool(token, [BASE_ISSUER, RESOURCE_ISSUER])
        ).resolves.toBe(false);
      });
    }
  });
});
