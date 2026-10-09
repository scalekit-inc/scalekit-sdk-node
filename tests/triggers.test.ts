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

    it('signs the exact body bytes (a leading BOM is covered by the signature)', () => {
      const body = Buffer.concat([
        Buffer.from([0xef, 0xbb, 0xbf]),
        fixture('valid_account.json'),
      ]);

      const event = verifyTriggerEvent({
        body,
        headers: signedHeaders(body),
        secret: SECRET,
      });
      expect(event.dedupeKey).toBe('dk_123');

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

    it('rejects a parsed object passed as the body, pointing at express.raw', () => {
      const body = validEventObject() as unknown as string;
      const headers = signedHeaders(JSON.stringify(body));

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      );
      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect((error as Error).message).toContain('got object');
      expect((error as Error).message).toContain('express.raw');
    });

    it.each([
      ['a non-string secret', undefined as unknown as string],
      ['a secret without a prefix', 'nounderscore'],
    ])('rejects %s', (_label, secret) => {
      const body = fixture('valid_account.json');

      expect(() =>
        verifyTriggerEvent({ body, headers: signedHeaders(body), secret })
      ).toThrow('Invalid secret');
    });

    it('keeps the cause when an unexpected error becomes Invalid Signature', () => {
      const body = fixture('valid_account.json');
      const headers = { ...signedHeaders(body), 'webhook-signature': 'v1' };

      const error = catchError(() =>
        verifyTriggerEvent({ body, headers, secret: SECRET })
      ) as WebhookVerificationError;

      expect(error).toBeInstanceOf(WebhookVerificationError);
      expect(error.message).toBe('Invalid Signature');
      expect((error.cause as Error).name).toBe('TypeError');
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
