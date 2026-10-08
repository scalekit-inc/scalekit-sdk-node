import type CoreClient from './core';
/** HTTP method that starts an upload session. */
export type ResumableUploadMethod = 'POST' | 'PUT' | 'PATCH';
/** What to upload, and where. Passed to `actions.uploadResumable`. */
export interface ResumableUploadParams {
    /** Connection name as shown in the dashboard, e.g. `'googledrive'`. Required; no CR/LF. */
    connectionName: string;
    /** Your application's identifier for the end user whose account is used. Required; no CR/LF. */
    identifier: string;
    /**
     * Provider upload path, e.g. `'/upload/drive/v3/files'`, or
     * `'/upload/drive/v3/files/{fileId}'` with `method: 'PATCH'` to replace a
     * file's content. A leading `/` is added if missing. Must not contain `?`,
     * `#`, spaces, control characters or `.`/`..` segments (also
     * percent-encoded): pass query parameters in `queryParams`.
     */
    path: string;
    /**
     * The content: bytes (`Buffer`, `Uint8Array`), or any async iterable of
     * bytes (`fs.createReadStream(file)`, a `Readable`, an async generator).
     * Streams are read one chunk at a time and never buffered whole.
     */
    data: Uint8Array | AsyncIterable<Uint8Array>;
    /**
     * Total size in bytes. Known automatically for bytes and for an unread
     * `fs.createReadStream(path)` with no `start`/`end`. When it is unknown,
     * the size is sent with the last chunk. If the stream turns out shorter or
     * longer than this, the upload fails with `ScalekitValidationError` before
     * the last chunk is sent.
     */
    totalBytes?: number;
    /** MIME type of the content. Defaults to `'application/octet-stream'`. Must not be empty or contain CR/LF. */
    contentType?: string;
    /** Resource metadata sent as JSON with the session-start request, e.g. `{ name, parents }`. */
    metadata?: Record<string, unknown>;
    /**
     * Extra query parameters for the session-start request only, e.g.
     * `{ supportsAllDrives: true }` or YouTube's `{ part: 'snippet,status' }`.
     * `uploadType` (exact, case-sensitive key) is set by the SDK and rejected here.
     */
    queryParams?: Record<string, string | number | boolean>;
    /** Method of the session-start request. Defaults to `'POST'`; Drive uses `'PATCH'` to replace content. */
    method?: ResumableUploadMethod;
    /** Bytes per chunk request. A positive multiple of 262144 (256 KiB). Defaults to 4 MiB. */
    chunkSize?: number;
}
/** Upload progress, as reported to `onProgress`. */
export interface UploadProgress {
    /** Bytes the server has confirmed so far. */
    readonly bytesCommitted: number;
    /** Total size, or `undefined` while it is not known yet. */
    readonly totalBytes: number | undefined;
}
/** Per-call options for `actions.uploadResumable`. */
export interface ResumableUploadOptions {
    /** Cancels the upload, including a wait between retries. Rejects with `ScalekitAbortError`. */
    signal?: AbortSignal;
    /**
     * Timeout for each HTTP request, in milliseconds. Defaults to the client's
     * `toolTimeoutMs` (60000 by default).
     */
    timeoutMs?: number;
    /**
     * Retries per chunk after a timeout, a connection error, HTTP 408, 429,
     * 500, 502, 503 or 504, or a 308 that commits no new bytes. Status checks
     * count too; the count resets only when the server confirms bytes beyond
     * the most it had confirmed before. Defaults to 3. `0` disables retries.
     * The session-start request is never retried.
     */
    maxRetries?: number;
    /**
     * Called each time the server confirms more bytes, and once when the upload
     * completes (a zero-byte upload gets one call with 0/0). The upload waits
     * for a returned promise. An error thrown here stops the upload and is
     * rethrown unchanged.
     */
    onProgress?: (progress: UploadProgress) => void | Promise<void>;
}
interface UploadPlan {
    connectionName: string;
    identifier: string;
    path: string;
    method: string;
    contentType: string;
    metadataJson: string | undefined;
    queryParams: Record<string, string | number | boolean>;
    chunkSize: number;
    totalBytes: number | undefined;
    data: Uint8Array | AsyncIterable<Uint8Array>;
    timeoutMs: number | undefined;
    maxRetries: number;
    onProgress: ((progress: UploadProgress) => void | Promise<void>) | undefined;
    signal: AbortSignal | undefined;
}
/**
 * Whether `{envUrl}/proxy{path}`, as the URL parser resolves it, stays under
 * the environment's `/proxy/` (same origin, same path prefix).
 *
 * @internal
 */
export declare function resolvesInsideProxy(envUrl: string, path: string): boolean;
/**
 * Checks every argument before any network call.
 *
 * @internal
 */
export declare function validateUploadParams(params: ResumableUploadParams, options: ResumableUploadOptions | undefined): UploadPlan;
/**
 * Full-jitter exponential backoff for the n-th retry (n starts at 0).
 *
 * @internal
 */
export declare function backoffDelayMs(retry: number, random?: () => number): number;
/**
 * Delay requested by a `Retry-After` header (delta-seconds or HTTP-date),
 * capped at 30 s. A past date or negative value means 0; an unparseable
 * value returns `undefined` so the caller falls back to backoff.
 *
 * @internal
 */
export declare function retryAfterDelayMs(value: string | undefined, now?: number): number | undefined;
/**
 * Uploads content with Google's resumable protocol through the Scalekit
 * proxy. See `ActionsClient.uploadResumable` for the contract.
 *
 * @internal
 */
export declare function uploadResumable(core: CoreClient, params: ResumableUploadParams, options?: ResumableUploadOptions): Promise<Record<string, unknown>>;
export {};
