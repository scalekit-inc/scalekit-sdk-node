export declare const WEBHOOK_TOLERANCE_IN_SECONDS: number;
export declare const WEBHOOK_SIGNATURE_VERSION = "v1";
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
export declare function verifyPayloadSignature(secret: string, id: string | undefined, timestamp: string | undefined, signature: string | undefined, payload: string | Uint8Array, options?: VerifyPayloadSignatureOptions): boolean;
