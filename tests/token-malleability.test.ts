// Both clients reject these variants of a validly signed token: a signature
// with a trailing "=", a signature with "!" inserted, and a token whose
// claims are not valid UTF-8 (rejected by jose 6.2.5 and later).
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest as jestGlobal,
} from '@jest/globals';
import crypto from 'node:crypto';
import ScalekitClient from '../src/scalekit';
import { ScalekitEdgeClient, ScalekitEdgeError } from '../src/edge';
import { ScalekitValidateTokenFailureException } from '../src/errors';

const b64 = (data: string | Buffer) => Buffer.from(data).toString('base64url');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});
const jwk = {
  ...publicKey.export({ format: 'jwk' }),
  kid: 'k1',
  alg: 'RS256',
  use: 'sig',
};
const header = b64(JSON.stringify({ alg: 'RS256', kid: 'k1' }));
const sign = (payloadSegment: string) => {
  const input = `${header}.${payloadSegment}`;
  return `${input}.${b64(crypto.sign('sha256', Buffer.from(input), privateKey))}`;
};
const exp = Math.floor(Date.now() / 1000) + 3600;

const valid = sign(b64(JSON.stringify({ sub: 'user_1', exp })));
const [h, p, s] = valid.split('.');
const variants: Array<[string, string]> = [
  ['a trailing "=" on the signature', `${valid}=`],
  [
    'a "!" inserted into the signature',
    `${h}.${p}.${s.slice(0, 10)}!${s.slice(10)}`,
  ],
  [
    'claims that are not valid UTF-8',
    sign(
      b64(
        Buffer.concat([
          Buffer.from('{"sub":"'),
          Buffer.from([0xff, 0xfe]),
          Buffer.from(`","exp":${exp}}`),
        ])
      )
    ),
  ],
];

describe('ScalekitClient token validation rejects re-encoded tokens', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    client = new ScalekitClient('https://example.invalid', 'id', 'secret');
    // Inject signing keys so CoreClient.getJwks() makes no request.
    (client as unknown as { coreClient: { keys: unknown[] } }).coreClient.keys =
      [jwk];
  });

  it('accepts the validly signed token', async () => {
    await expect(client.validateToken(valid)).resolves.toMatchObject({
      sub: 'user_1',
    });
  });

  it.each(variants)('rejects %s', async (_, token) => {
    await expect(client.validateToken(token)).rejects.toBeInstanceOf(
      ScalekitValidateTokenFailureException
    );
    await expect(client.validateAccessToken(token)).resolves.toBe(false);
  });
});

describe('ScalekitEdgeClient token validation rejects re-encoded tokens', () => {
  let client: ScalekitEdgeClient;

  beforeEach(() => {
    client = new ScalekitEdgeClient('https://example.invalid', 'id', 'secret');
    jestGlobal.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ keys: [jwk] }),
    } as Response);
  });

  afterEach(() => {
    jestGlobal.restoreAllMocks();
  });

  it('accepts the validly signed token', async () => {
    await expect(client.validateToken(valid)).resolves.toMatchObject({
      sub: 'user_1',
    });
  });

  it.each(variants)(
    'rejects %s with ScalekitEdgeError(401)',
    async (_, token) => {
      const error = await client.validateToken(token).then(
        () => undefined,
        (e: unknown) => e
      );
      expect(error).toBeInstanceOf(ScalekitEdgeError);
      expect((error as ScalekitEdgeError).statusCode).toBe(401);
    }
  );
});
