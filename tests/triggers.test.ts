// Credential-free unit tests for trigger event verification. Signatures are
// computed here with an independent HMAC so the tests do not trust the code
// under test to sign.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { describe, it, expect } from '@jest/globals';
import {
  Scalekit,
  verifyTriggerEvent,
  DeliveryScope,
  DetectionMode,
  PayloadState,
  ScalekitTriggerEventParseError,
  WebhookVerificationError,
  type TriggerEvent,
  type TriggerEventHeaders,
} from '../src/index';

const SIGNING_KEY = Buffer.from('trigger-test-signing-key-0123456789');
const SECRET = `whsec_${SIGNING_KEY.toString('base64')}`;
const OTHER_KEY = Buffer.from('some-other-signing-key-9876543210');
const MSG_ID = 'msg_test_1';

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function hmac(
  key: Buffer,
  id: string,
  ts: number,
  body: string | Uint8Array
): string {
  return crypto
    .createHmac('sha256', key)
    .update(`${id}.${ts}.`)
    .update(body)
    .digest('base64');
}

function signedHeaders(
  body: string | Uint8Array,
  opts: { id?: string; ts?: number; key?: Buffer } = {}
): Record<string, string> {
  const id = opts.id ?? MSG_ID;
  const ts = opts.ts ?? nowSeconds();
  return {
    'webhook-id': id,
    'webhook-timestamp': String(ts),
    'webhook-signature': `v1,${hmac(opts.key ?? SIGNING_KEY, id, ts, body)}`,
  };
}

function fixture(name: string): Buffer {
  return fs.readFileSync(
    path.join(__dirname, 'fixtures', 'trigger-events', name)
  );
}

function verifyFixture(name: string): TriggerEvent {
  const body = fixture(name);
  return verifyTriggerEvent({
    body,
    headers: signedHeaders(body),
    secret: SECRET,
  });
}

function verifyJson(value: unknown): TriggerEvent {
  const body = JSON.stringify(value);
  return verifyTriggerEvent({
    body,
    headers: signedHeaders(body),
    secret: SECRET,
  });
}

function validEventObject(): Record<string, unknown> {
  return JSON.parse(fixture('valid_account.json').toString('utf8'));
}

// A recent timestamp whose HMAC contains '+' or '/', so URL-safe re-encoding
// of the signature really changes it.
function tsWithPlusOrSlash(body: Uint8Array): number {
  let ts = nowSeconds();
  while (!/[+/]/.test(hmac(SIGNING_KEY, MSG_ID, ts, body))) {
    ts -= 1;
  }
  return ts;
}

function catchError(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('expected the call to throw');
}

describe('verifyTriggerEvent', () => {
  describe('fixtures', () => {
    it('parses an account-scoped event into camelCase fields', () => {
      const event = verifyFixture('valid_account.json');

      expect(event).toEqual({
        version: '1',
        triggerType: 'example.item.created',
        subscriptionId: 'sub_123',
        deliveryScope: 'account',
        connectionId: 'conn_123',
        connectedAccountId: 'ca_123',
        resourceType: 'message',
        resourceId: 'msg_123',
        // 12:30:45.123+05:30 is 07:00:45.123Z
        occurredAt: new Date('2026-10-01T07:00:45.123Z'),
        detectionMode: 'webhook',
        payloadState: 'full',
        payload: {
          subject: 'Hello',
          labels: ['INBOX', 'UNREAD'],
          size: 42,
          starred: false,
        },
        dedupeKey: 'dk_123',
        correlationId: 'corr_123',
        extra: {},
      });
      expect(event.deliveryScope).toBe(DeliveryScope.ACCOUNT);
      expect(event.detectionMode).toBe(DetectionMode.WEBHOOK);
      expect(event.payloadState).toBe(PayloadState.FULL);
      expect(Object.isFrozen(event)).toBe(true);
      expect(Object.isFrozen(event.extra)).toBe(true);
    });

    it('parses a connection-scoped event with an empty connected account and empty resource_id', () => {
      const event = verifyFixture('valid_connection_empty_account.json');

      expect(event.deliveryScope).toBe(DeliveryScope.CONNECTION);
      expect(event.connectedAccountId).toBe('');
      expect(event.resourceId).toBe('');
      expect(event.detectionMode).toBe(DetectionMode.POLL);
      expect(event.resourceType).toBe('channel');
      expect(event.payload).toEqual({ channel: 'general' });
      expect(event.occurredAt?.toISOString()).toBe('2026-10-01T07:00:45.000Z');
    });

    it('keeps unrecognised top-level fields in extra under their wire names', () => {
      const event = verifyFixture('extra_field.json');

      expect(event.extra).toEqual({
        delivery_attempt: 2,
        metadata: { region: 'test', tags: ['a', 'b'] },
      });
      expect(Object.keys(event.extra)).not.toContain('trigger_type');
      expect(event.triggerType).toBe('example.item.created');
    });

    it('passes unknown enum values through unchanged', () => {
      const event = verifyFixture('unknown_enum.json');

      expect(event.deliveryScope).toBe('organization');
      expect(event.detectionMode).toBe('stream');
      expect(event.payloadState).toBe('partial');
    });

    it('rejects a missing required field with a parse error naming it', () => {
      const error = catchError(() => verifyFixture('missing_required.json'));

      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).name).toBe('ScalekitTriggerEventParseError');
      expect((error as Error).message).toContain('"dedupe_key"');
    });

    it('rejects a field of the wrong type with a parse error naming it', () => {
      const error = catchError(() => verifyFixture('wrong_type.json'));

      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toContain('"version"');
      expect((error as Error).message).toContain('number');
    });

    it('maps a reference event with null payload and occurred_at', () => {
      const event = verifyFixture('null_payload_reference.json');

      expect(event.payloadState).toBe(PayloadState.REFERENCE);
      expect(event.payload).toBeNull();
      expect(event.resourceType).toBe('message');
      expect(event.resourceId).toBe('msg_123');
      expect(event.occurredAt).toBeUndefined();
    });

    it('rejects occurred_at without an offset', () => {
      const error = catchError(() => verifyFixture('bad_timestamp.json'));

      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toContain('"occurred_at"');
    });
  });

  describe('field mapping', () => {
    it('maps a null resource_id to undefined', () => {
      const raw = validEventObject();
      raw.resource_id = null;

      expect(verifyJson(raw).resourceId).toBeUndefined();
    });

    it('maps an absent payload to null and absent optional fields to undefined', () => {
      const raw = validEventObject();
      delete raw.payload;
      delete raw.resource_id;
      delete raw.occurred_at;

      const event = verifyJson(raw);

      expect(event.payload).toBeNull();
      expect(event.resourceId).toBeUndefined();
      expect(event.occurredAt).toBeUndefined();
    });

    it('accepts empty strings in required fields', () => {
      const raw = validEventObject();
      for (const key of ['trigger_type', 'dedupe_key', 'correlation_id']) {
        raw[key] = '';
      }

      const event = verifyJson(raw);

      expect(event.triggerType).toBe('');
      expect(event.dedupeKey).toBe('');
      expect(event.correlationId).toBe('');
    });

    it('does not pin version', () => {
      const raw = validEventObject();
      raw.version = '2';

      expect(verifyJson(raw).version).toBe('2');
    });

    it('rejects null in a required string field', () => {
      const raw = validEventObject();
      raw.connection_id = null;

      const error = catchError(() => verifyJson(raw));
      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toContain('"connection_id"');
      expect((error as Error).message).toContain('null');
    });

    it('rejects a non-string resource_id', () => {
      const raw = validEventObject();
      raw.resource_id = 42;

      expect(catchError(() => verifyJson(raw))).toBeInstanceOf(
        ScalekitTriggerEventParseError
      );
    });

    it('keeps a "__proto__" key as data in extra without touching the prototype', () => {
      const raw = validEventObject();
      const base = JSON.stringify(raw);
      const body = `${base.slice(0, -1)},"__proto__":{"polluted":true}}`;

      const event = verifyTriggerEvent({
        body,
        headers: signedHeaders(body),
        secret: SECRET,
      });

      expect(Object.getPrototypeOf(event.extra)).toBe(Object.prototype);
      expect(
        Object.prototype.hasOwnProperty.call(event.extra, '__proto__')
      ).toBe(true);
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it.each([
      ['2026-10-01T12:34:56Z', '2026-10-01T12:34:56.000Z'],
      ['2026-10-01t12:34:56z', '2026-10-01T12:34:56.000Z'],
      ['2026-10-01T12:34:56+00:00', '2026-10-01T12:34:56.000Z'],
      ['2026-10-01T05:34:56-07:00', '2026-10-01T12:34:56.000Z'],
      ['2026-10-01T12:34:56.5Z', '2026-10-01T12:34:56.500Z'],
      ['2026-10-01T12:34:56.123456789Z', '2026-10-01T12:34:56.123Z'],
      ['2024-02-29T00:00:00Z', '2024-02-29T00:00:00.000Z'],
      ['2026-01-01T00:30:00+01:00', '2025-12-31T23:30:00.000Z'],
      ['0001-01-01T00:00:00Z', '0001-01-01T00:00:00.000Z'],
    ])('parses occurred_at %s', (input, iso) => {
      const raw = validEventObject();
      raw.occurred_at = input;

      expect(verifyJson(raw).occurredAt?.toISOString()).toBe(iso);
    });

    it('maps an empty occurred_at to undefined', () => {
      const raw = validEventObject();
      raw.occurred_at = '';

      expect(verifyJson(raw).occurredAt).toBeUndefined();
    });

    it.each([
      ['2026-10-01T12:34:56'],
      ['2026-10-01 12:34:56Z'],
      ['2026-10-01T12:34Z'],
      ['2026-10-01T24:00:00Z'],
      ['2026-10-01T12:34:60Z'],
      ['2026-02-31T00:00:00Z'],
      ['2025-02-29T00:00:00Z'],
      ['2026-13-01T00:00:00Z'],
      ['2026-00-10T00:00:00Z'],
      ['2026-10-01T12:34:56+0530'],
      ['2026-10-01T12:34:56+05:60'],
      ['0000-01-01T00:00:00Z'],
      ['0000-06-15T12:00:00+00:00'],
      ['0001-01-01T00:30:00+01:00'],
      ['9999-12-31T23:30:00-01:00'],
      ['2026-10-01T12:34:56.Z'],
      ['2026-10-01'],
      ['1759322096'],
      ['Thu, 01 Oct 2026 12:34:56 GMT'],
      [1759322096],
      [true],
    ])('rejects occurred_at %p', (input) => {
      const raw = validEventObject();
      raw.occurred_at = input;

      const error = catchError(() => verifyJson(raw));
      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toContain('"occurred_at"');
    });

    it.each([
      ['0001-01-01T00:00:00Z', '0001-01-01T00:00:00.000Z'],
      ['0001-01-01T01:00:00+01:00', '0001-01-01T00:00:00.000Z'],
      ['9999-12-31T23:59:59.999Z', '9999-12-31T23:59:59.999Z'],
      ['9999-12-31T22:59:59-01:00', '9999-12-31T23:59:59.000Z'],
      ['2026-10-01T12:34:56+05:59', '2026-10-01T06:35:56.000Z'],
    ])('accepts occurred_at %p at the edge of the range', (input, iso) => {
      const raw = validEventObject();
      raw.occurred_at = input;

      expect(verifyJson(raw).occurredAt?.toISOString()).toBe(iso);
    });

    it.each([
      ['not json', 'not valid JSON'],
      ['[1,2]', 'JSON object, got array'],
      ['null', 'JSON object, got null'],
      ['"text"', 'JSON object, got string'],
    ])('rejects body %p as not a trigger event', (body, message) => {
      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body),
          secret: SECRET,
        })
      );

      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toContain(message);
    });
  });

  describe('signature', () => {
    it('rejects a bad signature with WebhookVerificationError, not a parse error', () => {
      const body = fixture('valid_account.json');
      const headers = signedHeaders(body, { key: OTHER_KEY });

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );

      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toBe('Invalid Signature');
    });

    it('checks the signature before parsing', () => {
      const body = 'not json';
      const headers = signedHeaders(body, { key: OTHER_KEY });

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );

      expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toBe('Invalid Signature');
    });

    it('rejects a body changed after signing', () => {
      const body = fixture('valid_account.json');
      const headers = signedHeaders(body);
      const tampered = Buffer.from(
        body.toString('utf8').replace('ca_123', 'ca_999')
      );

      expect(() =>
        verifyTriggerEvent({ body: tampered, headers, secret: SECRET })
      ).toThrow('Invalid Signature');
    });

    it('rejects a timestamp older than 5 minutes', () => {
      const body = fixture('valid_account.json');
      const headers = signedHeaders(body, { ts: nowSeconds() - 301 });

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Message timestamp too old');
    });

    it('rejects a timestamp more than 5 minutes in the future', () => {
      const body = fixture('valid_account.json');
      const headers = signedHeaders(body, { ts: nowSeconds() + 301 });

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Message timestamp too new');
    });

    it.each(['webhook-id', 'webhook-timestamp', 'webhook-signature'])(
      'rejects a request without %s',
      (name) => {
        const body = fixture('valid_account.json');
        const headers = signedHeaders(body);
        delete headers[name];

        const error = catchError(() =>
          verifyTriggerEvent({ body, headers, secret: SECRET })
        );
        expect(error).toBeInstanceOf(WebhookVerificationError);
        expect((error as Error).message).toBe('Missing required headers');
      }
    );

    it('matches header names case-insensitively', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        'Webhook-Id': signed['webhook-id'],
        'WEBHOOK-TIMESTAMP': signed['webhook-timestamp'],
        'Webhook-Signature': signed['webhook-signature'],
      };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('accepts a Fetch Headers instance', () => {
      const body = fixture('valid_account.json');
      const headers = new Headers(signedHeaders(body));

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('accepts IncomingHttpHeaders with webhook-signature as string[]', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const ts = Number(signed['webhook-timestamp']);
      const headers: TriggerEventHeaders = {
        'content-type': 'application/json',
        'webhook-id': signed['webhook-id'],
        'webhook-timestamp': signed['webhook-timestamp'],
        'webhook-signature': [
          `v1,${hmac(OTHER_KEY, MSG_ID, ts, body)}`,
          signed['webhook-signature'],
        ],
        'x-forwarded-for': undefined,
      };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it.each([
      ['webhook-id', ['msg_1', 'msg_2']],
      ['webhook-id', 'msg_1, msg_2'],
      ['webhook-timestamp', ['1759322096', '1759322097']],
    ])('rejects several different %s values', (name, value) => {
      const body = fixture('valid_account.json');
      const headers: Record<string, string | string[]> = {
        ...signedHeaders(body),
        [name]: value,
      };

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toBe(
        `Multiple ${name} headers with different values`
      );
    });

    it('rejects different webhook-id values under differently cased names', () => {
      const body = fixture('valid_account.json');
      const headers = { ...signedHeaders(body), 'Webhook-Id': 'msg_other' };

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Multiple webhook-id headers with different values');
    });

    it('accepts a repeated webhook-id with the same value', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = { ...signed, 'webhook-id': [MSG_ID, MSG_ID] };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('rejects a correctly signed body that is not valid UTF-8', () => {
      const body = Buffer.concat([
        Buffer.from('{"version":"1","x":"'),
        Buffer.from([0xff, 0xfe]),
        Buffer.from('"}'),
      ]);

      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body),
          secret: SECRET,
        })
      );

      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toBe(
        'Trigger event body is not valid UTF-8'
      );
      // Node's own TypeError comes from another realm than Jest's sandbox.
      expect(((error as WebhookVerificationError).cause as Error).name).toBe(
        'TypeError'
      );
    });

    it('rejects a correctly signed byte body with a leading BOM as a parse error', () => {
      const body = Buffer.concat([
        Buffer.from([0xef, 0xbb, 0xbf]),
        fixture('valid_account.json'),
      ]);

      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body),
          secret: SECRET,
        })
      );
      expect(error).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toContain('not valid JSON');

      // Signed without the BOM: must not verify against the BOM-prefixed bytes.
      const withoutBom = signedHeaders(fixture('valid_account.json'));
      expect(() =>
        verifyTriggerEvent({ body, headers: withoutBom, secret: SECRET })
      ).toThrow('Invalid Signature');
    });

    it('accepts Buffer, Uint8Array and string bodies alike', () => {
      const buffer = fixture('valid_connection_empty_account.json');
      const headers = signedHeaders(buffer);
      const bytes = new Uint8Array(buffer);
      const text = buffer.toString('utf8');

      const fromBuffer = verifyTriggerEvent({
        body: buffer,
        headers,
        secret: SECRET,
      });
      const fromBytes = verifyTriggerEvent({
        body: bytes,
        headers,
        secret: SECRET,
      });
      const fromText = verifyTriggerEvent({
        body: text,
        headers,
        secret: SECRET,
      });

      expect(fromBytes).toEqual(fromBuffer);
      expect(fromText).toEqual(fromBuffer);
    });

    it('verifies a non-ASCII string body over its UTF-8 bytes', () => {
      const raw = validEventObject();
      raw.payload = { title: 'Café ✓ 日本' };
      const text = JSON.stringify(raw);
      const headers = signedHeaders(Buffer.from(text, 'utf8'));

      expect(
        verifyTriggerEvent({ body: text, headers, secret: SECRET }).payload
      ).toEqual({ title: 'Café ✓ 日本' });
    });

    it('rejects a parsed object passed as the body with TypeError, pointing at express.raw', () => {
      const body = validEventObject() as unknown as string;
      const headers = signedHeaders(JSON.stringify(body));

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toContain('got object');
      expect((error as Error).message).toContain('express.raw');
    });

    it.each([
      ['a number body', { body: 42 }],
      ['a null body', { body: null }],
      ['null headers', { headers: null }],
      ['string headers', { headers: 'webhook-id: msg_1' }],
      ['an undefined secret', { secret: undefined }],
      ['a Buffer secret', { secret: Buffer.from(SECRET) }],
    ])('rejects %s with TypeError', (_label, override) => {
      const body = fixture('valid_account.json');
      const params = {
        body,
        headers: signedHeaders(body),
        secret: SECRET,
        ...override,
      } as unknown as Parameters<typeof verifyTriggerEvent>[0];

      const error = catchError(() => verifyTriggerEvent(params));
      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(WebhookVerificationError);
    });

    it.each([[null], [undefined], ['body']])(
      'rejects params %p with TypeError',
      (params) => {
        expect(() =>
          verifyTriggerEvent(
            params as unknown as Parameters<typeof verifyTriggerEvent>[0]
          )
        ).toThrow(TypeError);
      }
    );

    it('rejects a secret without a prefix', () => {
      const body = fixture('valid_account.json');

      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body),
          secret: 'nounderscore',
        })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toBe('Invalid secret');
    });

    // An empty key would let anyone sign with HMAC(key = '').
    const KEY_31 = Buffer.from('a-thirty-one-byte-signing-key!!');
    it.each([
      ['an empty key', 'whsec_', Buffer.alloc(0)],
      ['a key of only invalid characters', 'whsec_!!!!', Buffer.alloc(0)],
      ['a key of only padding', 'whsec_====', Buffer.alloc(0)],
      [
        'an unpadded key',
        `whsec_${KEY_31.toString('base64').replace(/=+$/, '')}`,
        KEY_31,
      ],
      ['a URL-safe key', `whsec_${KEY_31.toString('base64url')}=`, KEY_31],
      [
        'a key followed by another "_" part',
        `whsec_${SIGNING_KEY.toString('base64')}_extra`,
        SIGNING_KEY,
      ],
    ])(
      'rejects %s as an invalid secret even when the signature matches its lenient decoding',
      (_label, secret, lenientKey) => {
        const body = fixture('valid_account.json');
        const headers = signedHeaders(body, { key: lenientKey });

        const error = catchError(() =>
          verifyTriggerEvent({ body, headers, secret })
        );
        expect(error).toBeInstanceOf(WebhookVerificationError);
        expect((error as Error).message).toBe('Invalid secret');
      }
    );

    it('checks missing headers before the secret, and the secret before the timestamp format', () => {
      const body = fixture('valid_account.json');
      const { 'webhook-id': _id, ...noId } = signedHeaders(body);
      expect(() =>
        verifyTriggerEvent({ body, headers: noId, secret: 'whsec_' })
      ).toThrow('Missing required headers');

      const badTimestamp = {
        ...signedHeaders(body),
        'webhook-timestamp': '1e9',
      };
      expect(() =>
        verifyTriggerEvent({
          body,
          headers: badTimestamp,
          secret: 'whsec_!!!!',
        })
      ).toThrow('Invalid secret');
    });

    it('accepts a padded standard base64 key of 31 bytes', () => {
      const body = fixture('valid_account.json');
      const secret = `whsec_${KEY_31.toString('base64')}`;
      expect(secret.endsWith('=')).toBe(true);

      expect(
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body, { key: KEY_31 }),
          secret,
        }).dedupeKey
      ).toBe('dk_123');
    });

    it.each([
      ['a number', 'webhook-id', 123],
      ['an array with a number', 'webhook-signature', ['v1,AAAA', 1]],
      ['null', 'webhook-timestamp', null],
      ['an object', 'webhook-id', { value: 'msg_1' }],
    ])('rejects %s as a header value with TypeError', (_label, name, value) => {
      const body = fixture('valid_account.json');
      const headers = {
        ...signedHeaders(body),
        [name]: value,
      } as unknown as TriggerEventHeaders;

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toContain(name);
    });

    it.each([
      ['req.rawHeaders (a flat array)', 'rawHeaders'],
      ['an empty array', 'empty'],
      ['a Set', 'set'],
      ['a Buffer', 'buffer'],
      ['a class instance', 'instance'],
    ])('rejects %s as headers with TypeError', (_label, kind) => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const flat = Object.entries(signed).flat();
      const candidates: Record<string, unknown> = {
        rawHeaders: flat,
        empty: [],
        set: new Set(flat),
        buffer: Buffer.from(JSON.stringify(signed)),
        instance: Object.assign(new (class Hdrs {})(), signed),
      };
      const headers = candidates[kind] as TriggerEventHeaders;

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(TypeError);
      expect(error).not.toBeInstanceOf(WebhookVerificationError);
    });

    it('accepts a null-prototype headers object', () => {
      const body = fixture('valid_account.json');
      const headers = Object.assign(Object.create(null), signedHeaders(body));

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('accepts a Map with the headers present', () => {
      const body = fixture('valid_account.json');
      const headers = new Map(Object.entries(signedHeaders(body)));

      expect(
        verifyTriggerEvent({
          body,
          headers: headers as unknown as TriggerEventHeaders,
          secret: SECRET,
        }).dedupeKey
      ).toBe('dk_123');
    });

    it('treats a key missing from a Map as an absent header', () => {
      const body = fixture('valid_account.json');
      const headers = new Map(Object.entries(signedHeaders(body)));
      headers.delete('webhook-id');

      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: headers as unknown as TriggerEventHeaders,
          secret: SECRET,
        })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toBe('Missing required headers');
    });

    it('rejects a non-string Map value with TypeError naming the header', () => {
      const body = fixture('valid_account.json');
      const headers = new Map<string, unknown>(
        Object.entries(signedHeaders(body))
      );
      headers.set('webhook-timestamp', 123);

      const error = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: headers as unknown as TriggerEventHeaders,
          secret: SECRET,
        })
      );
      expect(error).toBeInstanceOf(TypeError);
      expect((error as Error).message).toContain('webhook-timestamp');
    });

    it('ignores non-string values of headers it does not read', () => {
      const body = fixture('valid_account.json');
      const headers = {
        ...signedHeaders(body),
        'x-count': 3,
      } as unknown as TriggerEventHeaders;

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it.each([
      ['a lone high surrogate', '\uD800'],
      ['a lone low surrogate', '\uDC00'],
      ['reversed surrogates', '\uDC00\uD800'],
    ])('rejects a string body containing %s', (_label, chars) => {
      const raw = validEventObject();
      raw.payload = { title: `x${chars}y` };
      const text = JSON.stringify(raw).replace(
        /\\u(d[89a-f][0-9a-f]{2})/gi,
        (_m, hex: string) => String.fromCharCode(parseInt(hex, 16))
      );
      expect(text).toContain(chars);
      // Node encodes the lone surrogate as U+FFFD, so this is what a sender
      // signing that string would have produced.
      const headers = signedHeaders(Buffer.from(text, 'utf8'));

      const error = catchError(() =>
        verifyTriggerEvent({ body: text, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((error as Error).message).toBe(
        'Trigger event body is not valid UTF-8'
      );
    });

    it('accepts a string body with a correctly paired surrogate', () => {
      const raw = validEventObject();
      raw.payload = { title: 'emoji \u{1F600}' };
      const text = JSON.stringify(raw);
      const headers = signedHeaders(Buffer.from(text, 'utf8'));

      expect(
        verifyTriggerEvent({ body: text, headers, secret: SECRET }).payload
      ).toEqual({ title: 'emoji \u{1F600}' });
    });

    it.each([['-1'], ['+1'], ['1.5'], [' 1'], ['1 '], ['1e9'], [''], ['0x10']])(
      'rejects webhook-timestamp %p as invalid headers',
      (ts) => {
        const body = fixture('valid_account.json');
        const headers = { ...signedHeaders(body), 'webhook-timestamp': ts };

        const error = catchError(() =>
          verifyTriggerEvent({ body, headers, secret: SECRET })
        );
        expect(error).toBeInstanceOf(WebhookVerificationError);
        expect((error as Error).message).toBe('Invalid Signature Headers');
      }
    );

    it('rejects a timestamp with a trailing suffix even when signed over its digits', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        ...signed,
        'webhook-timestamp': `${signed['webhook-timestamp']}abc`,
      };

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Invalid Signature Headers');
    });

    it('rejects an empty webhook-timestamp in a Fetch Headers instance', () => {
      const body = fixture('valid_account.json');
      const headers = new Headers({
        ...signedHeaders(body),
        'webhook-timestamp': '',
      });

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Invalid Signature Headers');
    });

    it('skips a short v1 candidate and accepts a later valid one', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        ...signed,
        'webhook-signature': ['v1,AAAA', signed['webhook-signature']],
      };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('skips a candidate without a comma and accepts a later valid one', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        ...signed,
        'webhook-signature': `v1 ${signed['webhook-signature']}`,
      };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it('skips other versions and accepts a later v1 candidate', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        ...signed,
        'webhook-signature': `v2,${signed['webhook-signature'].slice(3)} ${signed['webhook-signature']}`,
      };

      expect(
        verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
      ).toBe('dk_123');
    });

    it.each([
      ['v1'],
      ['v1,AAAA'],
      ['v1,'],
      ['v1 v1,AAAA garbage'],
      [['v1,AAAA', 'v1']],
    ])(
      'rejects only-malformed signatures %p with WebhookVerificationError',
      (signature) => {
        const body = fixture('valid_account.json');
        const headers = {
          ...signedHeaders(body),
          'webhook-signature': signature,
        };

        const error = catchError(() =>
          verifyTriggerEvent({ body, headers, secret: SECRET })
        );
        expect(error).toBeInstanceOf(WebhookVerificationError);
        expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
        expect((error as Error).message).toBe('Invalid Signature');
      }
    );

    const MALFORMED_LABELS = [
      'unpadded',
      'URL-safe',
      'URL-safe unpadded',
      'non-ASCII',
      'a non-base64 character',
      'over-padded',
    ];

    // The valid HMAC, re-encoded in ways a lenient base64 decoder accepts.
    function malformedVariants(valid: string): Array<[string, string]> {
      const b64 = valid.slice(3);
      const unpadded = b64.replace(/=+$/, '');
      return [
        ['unpadded', `v1,${unpadded}`],
        ['URL-safe', `v1,${b64.replace(/\+/g, '-').replace(/\//g, '_')}`],
        [
          'URL-safe unpadded',
          `v1,${unpadded.replace(/\+/g, '-').replace(/\//g, '_')}`,
        ],
        ['non-ASCII', `v1,${b64.slice(0, -2)}é=`],
        ['a non-base64 character', `v1,${b64.slice(0, 4)}.${b64.slice(5)}`],
        ['over-padded', `v1,${b64}=`],
      ];
    }

    it.each(MALFORMED_LABELS)(
      'skips a %s candidate and accepts a valid one alongside',
      (name) => {
        const body = fixture('valid_account.json');
        const signed = signedHeaders(body, { ts: tsWithPlusOrSlash(body) });
        const bad = malformedVariants(signed['webhook-signature']).find(
          ([label]) => label === name
        )![1];
        const headers = {
          ...signed,
          'webhook-signature': `${bad} ${signed['webhook-signature']}`,
        };

        expect(
          verifyTriggerEvent({ body, headers, secret: SECRET }).dedupeKey
        ).toBe('dk_123');
      }
    );

    it.each(MALFORMED_LABELS)('rejects a %s candidate on its own', (name) => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body, { ts: tsWithPlusOrSlash(body) });
      const bad = malformedVariants(signed['webhook-signature']).find(
        ([label]) => label === name
      )![1];
      const headers = { ...signed, 'webhook-signature': bad };

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toBe('Invalid Signature');
    });

    it('rejects a v2 candidate carrying the right HMAC', () => {
      const body = fixture('valid_account.json');
      const signed = signedHeaders(body);
      const headers = {
        ...signed,
        'webhook-signature': `v2,${signed['webhook-signature'].slice(3)}`,
      };

      expect(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ).toThrow('Invalid Signature');
    });

    it('rejects a string body that starts with a BOM as not JSON', () => {
      const text = `\uFEFF${fixture('valid_account.json').toString('utf8')}`;
      const headers = signedHeaders(Buffer.from(text, 'utf8'));

      expect(
        catchError(() =>
          verifyTriggerEvent({ body: text, headers, secret: SECRET })
        )
      ).toBeInstanceOf(ScalekitTriggerEventParseError);
    });

    it('never puts the body or the secret in error messages or inspected output', () => {
      const body = 'not json: SENSITIVE-PAYLOAD-MARKER';
      const parseError = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body),
          secret: SECRET,
        })
      );
      const signatureError = catchError(() =>
        verifyTriggerEvent({
          body,
          headers: signedHeaders(body, { key: OTHER_KEY }),
          secret: SECRET,
        })
      );

      for (const error of [parseError, signatureError]) {
        const printed = util.inspect(error, { depth: 5 });
        expect(printed).not.toContain('SENSITIVE-PAYLOAD-MARKER');
        expect(printed).not.toContain(SIGNING_KEY.toString('base64'));
      }
    });
  });

  describe('scalekit.actions.triggers.verifyEvent', () => {
    const client = new Scalekit(
      'https://example.scalekit.dev',
      'skc_test',
      'test_client_secret'
    );

    it('returns the same event as the standalone function', () => {
      const body = fixture('extra_field.json');
      const params = { body, headers: signedHeaders(body), secret: SECRET };

      expect(client.actions.triggers.verifyEvent(params)).toEqual(
        verifyTriggerEvent(params)
      );
    });

    it('throws the same errors as the standalone function', () => {
      const body = fixture('missing_required.json');
      const params = { body, headers: signedHeaders(body), secret: SECRET };

      const fromClient = catchError(() =>
        client.actions.triggers.verifyEvent(params)
      );
      const standalone = catchError(() => verifyTriggerEvent(params));

      expect(fromClient).toBeInstanceOf(ScalekitTriggerEventParseError);
      expect((fromClient as Error).message).toBe((standalone as Error).message);
    });
  });
});

// The existing methods must behave exactly as before the signature code moved.
describe('verifyWebhookPayload / verifyInterceptorPayload (unchanged behaviour)', () => {
  const client = new Scalekit(
    'https://example.scalekit.dev',
    'skc_test',
    'test_client_secret'
  );
  const payload = '{"type":"organization.created","data":{"id":"org_123"}}';

  function webhookHeaders(
    opts: { ts?: number | string; key?: Buffer; body?: string } = {}
  ): Record<string, string> {
    const tsValue = opts.ts ?? nowSeconds();
    const ts = typeof tsValue === 'number' ? tsValue : parseInt(tsValue, 10);
    return {
      'webhook-id': MSG_ID,
      'webhook-timestamp': String(tsValue),
      'webhook-signature': `v1,${hmac(opts.key ?? SIGNING_KEY, MSG_ID, ts, opts.body ?? payload)}`,
    };
  }

  it('returns true for a valid payload', () => {
    expect(client.verifyWebhookPayload(SECRET, webhookHeaders(), payload)).toBe(
      true
    );
  });

  it('returns true for a valid interceptor payload', () => {
    const signed = webhookHeaders();
    const headers = {
      'interceptor-id': signed['webhook-id'],
      'interceptor-timestamp': signed['webhook-timestamp'],
      'interceptor-signature': signed['webhook-signature'],
    };
    expect(client.verifyInterceptorPayload(SECRET, headers, payload)).toBe(
      true
    );
  });

  it.each([
    [
      'a wrong signature',
      () => webhookHeaders({ key: OTHER_KEY }),
      SECRET,
      'Invalid Signature',
    ],
    [
      'a stale timestamp',
      () => webhookHeaders({ ts: nowSeconds() - 301 }),
      SECRET,
      'Message timestamp too old',
    ],
    [
      'a future timestamp',
      () => webhookHeaders({ ts: nowSeconds() + 301 }),
      SECRET,
      'Message timestamp too new',
    ],
    [
      'a non-numeric timestamp',
      () => ({ ...webhookHeaders(), 'webhook-timestamp': 'abc' }),
      SECRET,
      'Invalid Signature Headers',
    ],
    [
      'a secret without a prefix',
      () => webhookHeaders(),
      'nounderscore',
      'Invalid secret',
    ],
    [
      'a missing id header',
      () => ({ ...webhookHeaders(), 'webhook-id': '' }),
      SECRET,
      'Missing required headers',
    ],
    [
      'a malformed signature entry',
      () => ({ ...webhookHeaders(), 'webhook-signature': 'v1' }),
      SECRET,
      'Invalid Signature',
    ],
  ])(
    'rejects %s with the same message as before',
    (_label, headers, secret, message) => {
      const error = catchError(() =>
        client.verifyWebhookPayload(secret, headers(), payload)
      ) as WebhookVerificationError;

      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect(error).not.toBeInstanceOf(ScalekitTriggerEventParseError);
      expect(error.name).toBe('WebhookVerificationError');
      expect(error.message).toBe(message);
      expect(error.cause).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(error, 'cause')).toBe(false);
    }
  );

  it('still reads header names case-sensitively', () => {
    const signed = webhookHeaders();
    const headers = {
      'Webhook-Id': signed['webhook-id'],
      'webhook-timestamp': signed['webhook-timestamp'],
      'webhook-signature': signed['webhook-signature'],
    };

    expect(() => client.verifyWebhookPayload(SECRET, headers, payload)).toThrow(
      'Missing required headers'
    );
  });

  it('still parses the timestamp with parseInt and signs the parsed value', () => {
    const ts = nowSeconds();
    const headers = webhookHeaders({ ts: `${ts}xyz` });

    expect(client.verifyWebhookPayload(SECRET, headers, payload)).toBe(true);
  });

  it('still uses the part after the first "_" of the secret as the key', () => {
    const secret = `whsec_${SIGNING_KEY.toString('base64')}_ignored`;

    expect(client.verifyWebhookPayload(secret, webhookHeaders(), payload)).toBe(
      true
    );
  });

  it('still ends the check on a malformed candidate before a valid one', () => {
    const signed = webhookHeaders();
    const headers = {
      ...signed,
      'webhook-signature': `v1,AAAA ${signed['webhook-signature']}`,
    };

    expect(() => client.verifyWebhookPayload(SECRET, headers, payload)).toThrow(
      'Invalid Signature'
    );
  });

  it('still signs a non-string payload as its string form', () => {
    const ts = nowSeconds();
    const headers = {
      'webhook-id': MSG_ID,
      'webhook-timestamp': String(ts),
      'webhook-signature': `v1,${hmac(SIGNING_KEY, MSG_ID, ts, '12345')}`,
    };

    expect(
      client.verifyWebhookPayload(SECRET, headers, 12345 as unknown as string)
    ).toBe(true);
  });

  it('still throws a raw TypeError for a non-string secret', () => {
    expect(() =>
      client.verifyWebhookPayload(
        undefined as unknown as string,
        webhookHeaders(),
        payload
      )
    ).toThrow(TypeError);
  });
});
