// Internal: HMAC signature checks shared by `verifyWebhookPayload`,
// `verifyInterceptorPayload` and `verifyTriggerEvent`. Not exported from the
// package root.
//
// `verifyPayloadSignature` keeps the exact behaviour the public
// `verifyWebhookPayload` / `verifyInterceptorPayload` methods have always had
// (messages, order of checks, `parseInt` timestamp parsing, `secret.split('_')[1]`
// as the key). Stricter input handling belongs in the callers, not here.
import crypto from 'crypto';
import { WebhookVerificationError } from './errors/base-exception';

export const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60; // 5 minutes
export const WEBHOOK_SIGNATURE_VERSION = 'v1';

export interface VerifyPayloadSignatureOptions {
  /**
   * Keep the underlying error as `cause` when an unexpected (non-verification)
   * error is turned into `WebhookVerificationError('Invalid Signature')`.
   * Off for the legacy methods so their errors stay exactly as before.
   */
  keepCause?: boolean;
  /**
   * Skip malformed `webhook-signature` candidates and keep trying the rest. A
   * candidate is malformed when it has no `,`, when the part after `v1,` is
   * not strict padded standard base64 (only `A-Z a-z 0-9 + /`, at most two
   * trailing `=`, length a multiple of 4; so unpadded, URL-safe and non-ASCII
   * values are skipped), or when it decodes to a length other than an
   * HMAC-SHA256. Off for the legacy methods, where such a candidate ends the
   * check with "Invalid Signature" as it always has.
   */
  skipMalformedSignatures?: boolean;
  /**
   * Require `timestamp` to be decimal digits only (`^[0-9]+$`); anything else,
   * including an empty value, throws "Invalid Signature Headers" instead of
   * being read with `parseInt`. An absent (`undefined`) timestamp still throws
   * "Missing required headers". Off for the legacy methods.
   */
  strictTimestamp?: boolean;
  /**
   * Require the key after the first `_` of the secret (`whsec_<key>`) to be
   * non-empty strict padded standard base64 that decodes to at least one
   * byte; otherwise throw "Invalid secret". Without it the key is decoded
   * leniently, so `whsec_`, `whsec_!!!!` or `whsec_====` give an empty HMAC
   * key. Off for the legacy methods.
   */
  strictSecret?: boolean;
}

/**
 * Verifies a `v1` HMAC-SHA256 signature over `${id}.${timestamp}.${payload}`
 * with a 5-minute timestamp tolerance, comparing in constant time.
 *
 * @param secret - Signing secret, `whsec_<base64 key>`.
 * @param id - Message ID header value.
 * @param timestamp - Unix-seconds timestamp header value.
 * @param signature - Space-separated `v1,<base64>` signatures.
 * @param payload - Raw body. A `Uint8Array` is signed byte for byte; a string
 *   is signed as its UTF-8 encoding.
 * @param options - See {@link VerifyPayloadSignatureOptions}.
 * @returns `true` when a signature matches.
 * @throws {@link WebhookVerificationError} when headers are missing, the
 *   secret is malformed, the timestamp is out of tolerance or no signature
 *   matches.
 */
export function verifyPayloadSignature(
  secret: string,
  id: string | undefined,
  timestamp: string | undefined,
  signature: string | undefined,
  payload: string | Uint8Array,
  options?: VerifyPayloadSignatureOptions
): boolean {
  const timestampMissing = options?.strictTimestamp
    ? timestamp === undefined
    : !timestamp;
  if (!id || timestampMissing || !signature) {
    throw new WebhookVerificationError('Missing required headers');
  }

  const secretParts = secret.split('_');
  if (secretParts.length < 2) {
    throw new WebhookVerificationError('Invalid secret');
  }
  let strictKey: Buffer | undefined;
  if (options?.strictSecret) {
    // Everything after the first '_': a second '_' is not base64 and fails.
    const encodedKey = secret.slice(secret.indexOf('_') + 1);
    strictKey = isStrictBase64(encodedKey)
      ? Buffer.from(encodedKey, 'base64')
      : undefined;
    if (strictKey === undefined || strictKey.length === 0) {
      throw new WebhookVerificationError('Invalid secret');
    }
  }

  try {
    const timestampDate = verifyTimestamp(
      timestamp as string,
      options?.strictTimestamp === true
    );
    const signedPrefix = `${id}.${Math.floor(timestampDate.getTime() / 1000)}.`;
    const secretBytes = strictKey ?? Buffer.from(secretParts[1], 'base64');
    const computedSignature = computeSignature(
      secretBytes,
      signedPrefix,
      payload
    );
    const receivedSignatures = signature.split(' ');

    if (options?.skipMalformedSignatures) {
      const expected = Buffer.from(computedSignature, 'base64');
      for (const candidate of receivedSignatures) {
        if (candidateMatches(candidate, expected)) {
          return true;
        }
      }
      throw new WebhookVerificationError('Invalid Signature');
    }

    for (const versionedSignature of receivedSignatures) {
      const [version, receivedSignature] = versionedSignature.split(',');
      if (version !== WEBHOOK_SIGNATURE_VERSION) {
        continue;
      }
      if (
        crypto.timingSafeEqual(
          Buffer.from(receivedSignature, 'base64'),
          Buffer.from(computedSignature, 'base64')
        )
      ) {
        return true;
      }
    }

    throw new WebhookVerificationError('Invalid Signature');
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      throw error;
    }
    throw new WebhookVerificationError(
      'Invalid Signature',
      options?.keepCause ? { cause: error } : undefined
    );
  }
}

// Strict padded standard base64. Buffer.from(_, 'base64') is lenient (it
// accepts URL-safe characters, missing padding and ignores junk), so the
// candidate is checked against the grammar before decoding.
const STRICT_BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;
const DIGITS_ONLY = /^[0-9]+$/;

function isStrictBase64(value: string): boolean {
  return STRICT_BASE64.test(value) && value.length % 4 === 0;
}

// One `v1,<base64>` candidate. Anything malformed is simply not a match;
// timingSafeEqual is only reached with equal lengths, so it cannot throw.
function candidateMatches(candidate: string, expected: Buffer): boolean {
  if (!candidate.includes(',')) {
    return false;
  }
  const [version, received] = candidate.split(',');
  if (version !== WEBHOOK_SIGNATURE_VERSION) {
    return false;
  }
  if (!isStrictBase64(received)) {
    return false;
  }
  const receivedBytes = Buffer.from(received, 'base64');
  if (receivedBytes.length !== expected.length) {
    return false;
  }
  return crypto.timingSafeEqual(receivedBytes, expected);
}

function verifyTimestamp(timestampStr: string, strict: boolean): Date {
  if (strict && !DIGITS_ONLY.test(timestampStr)) {
    throw new WebhookVerificationError('Invalid Signature Headers');
  }
  const now = Math.floor(Date.now() / 1000);
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    throw new WebhookVerificationError('Invalid Signature Headers');
  }
  if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
    throw new WebhookVerificationError('Message timestamp too old');
  }
  if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
    throw new WebhookVerificationError('Message timestamp too new');
  }

  return new Date(timestamp * 1000);
}

// HMAC is computed incrementally over the ASCII prefix and then the body, which
// for a string body is byte-identical to hashing `${prefix}${body}` as one
// UTF-8 string (the prefix ends in '.', so no character straddles the join).
function computeSignature(
  secretBytes: Buffer,
  signedPrefix: string,
  payload: string | Uint8Array
): string {
  return crypto
    .createHmac('sha256', secretBytes)
    .update(signedPrefix)
    .update(payload)
    .digest('base64');
}
