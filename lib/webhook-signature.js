"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_SIGNATURE_VERSION = exports.WEBHOOK_TOLERANCE_IN_SECONDS = void 0;
exports.verifyPayloadSignature = verifyPayloadSignature;
// Internal: HMAC signature checks shared by `verifyWebhookPayload`,
// `verifyInterceptorPayload` and `verifyTriggerEvent`. Not exported from the
// package root.
//
// `verifyPayloadSignature` keeps the exact behaviour the public
// `verifyWebhookPayload` / `verifyInterceptorPayload` methods have always had
// (messages, order of checks, `parseInt` timestamp parsing, `secret.split('_')[1]`
// as the key). Stricter input handling belongs in the callers, not here.
const crypto_1 = __importDefault(require("crypto"));
const base_exception_1 = require("./errors/base-exception");
exports.WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60; // 5 minutes
exports.WEBHOOK_SIGNATURE_VERSION = 'v1';
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
function verifyPayloadSignature(secret, id, timestamp, signature, payload, options) {
    const timestampMissing = (options === null || options === void 0 ? void 0 : options.strictTimestamp)
        ? timestamp === undefined
        : !timestamp;
    if (!id || timestampMissing || !signature) {
        throw new base_exception_1.WebhookVerificationError('Missing required headers');
    }
    const secretParts = secret.split('_');
    if (secretParts.length < 2) {
        throw new base_exception_1.WebhookVerificationError('Invalid secret');
    }
    try {
        const timestampDate = verifyTimestamp(timestamp, (options === null || options === void 0 ? void 0 : options.strictTimestamp) === true);
        const signedPrefix = `${id}.${Math.floor(timestampDate.getTime() / 1000)}.`;
        const secretBytes = Buffer.from(secretParts[1], 'base64');
        const computedSignature = computeSignature(secretBytes, signedPrefix, payload);
        const receivedSignatures = signature.split(' ');
        if (options === null || options === void 0 ? void 0 : options.skipMalformedSignatures) {
            const expected = Buffer.from(computedSignature, 'base64');
            for (const candidate of receivedSignatures) {
                if (candidateMatches(candidate, expected)) {
                    return true;
                }
            }
            throw new base_exception_1.WebhookVerificationError('Invalid Signature');
        }
        for (const versionedSignature of receivedSignatures) {
            const [version, receivedSignature] = versionedSignature.split(',');
            if (version !== exports.WEBHOOK_SIGNATURE_VERSION) {
                continue;
            }
            if (crypto_1.default.timingSafeEqual(Buffer.from(receivedSignature, 'base64'), Buffer.from(computedSignature, 'base64'))) {
                return true;
            }
        }
        throw new base_exception_1.WebhookVerificationError('Invalid Signature');
    }
    catch (error) {
        if (error instanceof base_exception_1.WebhookVerificationError) {
            throw error;
        }
        throw new base_exception_1.WebhookVerificationError('Invalid Signature', (options === null || options === void 0 ? void 0 : options.keepCause) ? { cause: error } : undefined);
    }
}
// Strict padded standard base64. Buffer.from(_, 'base64') is lenient (it
// accepts URL-safe characters, missing padding and ignores junk), so the
// candidate is checked against the grammar before decoding.
const STRICT_BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;
const DIGITS_ONLY = /^[0-9]+$/;
// One `v1,<base64>` candidate. Anything malformed is simply not a match;
// timingSafeEqual is only reached with equal lengths, so it cannot throw.
function candidateMatches(candidate, expected) {
    if (!candidate.includes(',')) {
        return false;
    }
    const [version, received] = candidate.split(',');
    if (version !== exports.WEBHOOK_SIGNATURE_VERSION) {
        return false;
    }
    if (!STRICT_BASE64.test(received) || received.length % 4 !== 0) {
        return false;
    }
    const receivedBytes = Buffer.from(received, 'base64');
    if (receivedBytes.length !== expected.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(receivedBytes, expected);
}
function verifyTimestamp(timestampStr, strict) {
    if (strict && !DIGITS_ONLY.test(timestampStr)) {
        throw new base_exception_1.WebhookVerificationError('Invalid Signature Headers');
    }
    const now = Math.floor(Date.now() / 1000);
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
        throw new base_exception_1.WebhookVerificationError('Invalid Signature Headers');
    }
    if (now - timestamp > exports.WEBHOOK_TOLERANCE_IN_SECONDS) {
        throw new base_exception_1.WebhookVerificationError('Message timestamp too old');
    }
    if (timestamp > now + exports.WEBHOOK_TOLERANCE_IN_SECONDS) {
        throw new base_exception_1.WebhookVerificationError('Message timestamp too new');
    }
    return new Date(timestamp * 1000);
}
// HMAC is computed incrementally over the ASCII prefix and then the body, which
// for a string body is byte-identical to hashing `${prefix}${body}` as one
// UTF-8 string (the prefix ends in '.', so no character straddles the join).
function computeSignature(secretBytes, signedPrefix, payload) {
    return crypto_1.default
        .createHmac('sha256', secretBytes)
        .update(signedPrefix)
        .update(payload)
        .digest('base64');
}
//# sourceMappingURL=webhook-signature.js.map