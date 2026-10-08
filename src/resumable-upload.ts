import { ReadStream, promises as fsPromises } from 'fs';
import {
  AxiosError,
  AxiosHeaders,
  isCancel,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type CoreClient from './core';
import {
  ScalekitAbortError,
  ScalekitException,
  ScalekitServerException,
  ScalekitValidationError,
} from './errors/base-exception';
import { ScalekitGatewayTimeoutException } from './errors/specific-exceptions';
import {
  ScalekitUploadConnectionException,
  ScalekitUploadHttpException,
  ScalekitUploadProtocolException,
  ScalekitUploadSessionExpiredException,
  ScalekitUploadTimeoutException,
} from './errors/upload-exceptions';

// Google's resumable upload protocol (Drive v3, the Cloud Storage JSON API,
// YouTube Data API), sent through the Scalekit proxy:
//
//   1. <method> /proxy{path}?uploadType=resumable  -> 2xx, Location: ...upload_id=<id>
//   2. PUT /proxy{path}?uploadType=resumable&upload_id=<id>, one per chunk,
//      Content-Range: bytes a-b/<total|*>         -> 308 (Range: bytes=0-N) | 200/201
//   3. after a failed chunk, a status query:
//      PUT ... with no body, Content-Range: bytes */<total|*>  -> 308 | 200/201
//
// The helper makes its own axios calls rather than going through
// `actions.request`, because it must read 308 responses (and their `Range`
// header) as normal responses and must never follow a redirect.

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

/** Google requires every chunk except the last to be a multiple of this. */
const CHUNK_GRANULARITY = 256 * 1024;
const DEFAULT_CHUNK_SIZE = 4 * 1024 * 1024;
const DEFAULT_CONTENT_TYPE = 'application/octet-stream';
const DEFAULT_MAX_RETRIES = 3;
/** Full-jitter backoff: random() * min(cap, base * 2^n), n starting at 0. */
const BACKOFF_BASE_MS = 500;
const BACKOFF_CAP_MS = 8_000;
/** Longest `Retry-After` wait honoured. */
const RETRY_AFTER_CAP_MS = 30_000;
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([
  408, 429, 500, 502, 503, 504,
]);
const SESSION_GONE_STATUSES: ReadonlySet<number> = new Set([404, 410]);
const UPLOAD_METHODS: ReadonlySet<string> = new Set(['POST', 'PUT', 'PATCH']);

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function requireNonEmptyString(name: string, value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ScalekitValidationError(`${name} is required`);
  }
  return value;
}

/** A value sent as an HTTP header: non-empty and without CR or LF. */
function requireHeaderValue(name: string, value: unknown): string {
  const text = requireNonEmptyString(name, value);
  if (/[\r\n]/.test(text)) {
    throw new ScalekitValidationError(
      `${name} must not contain CR or LF characters`
    );
  }
  return text;
}

/**
 * Rejects path forms that would change where the request goes: a query
 * string or fragment (the SDK builds the query itself) and dot segments,
 * which URL resolution would collapse, possibly out of `/proxy`. Encoded
 * dots and backslashes are treated the way the URL parser treats them.
 */
function validatePath(path: string): string {
  // The URL parser deletes tab, CR and LF, so ".\t." would become "..".
  // Reject every control character and space outright.
  if (/[\x00-\x20\x7f]/.test(path)) {
    throw new ScalekitValidationError(
      'path must not contain spaces or control characters'
    );
  }
  if (path.includes('?') || path.includes('#')) {
    throw new ScalekitValidationError(
      'path must not contain "?" or "#"; pass query parameters in queryParams'
    );
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  for (const segment of normalized.split(/[\\/]/)) {
    const decoded = segment.replace(/%2e/gi, '.');
    if (decoded === '.' || decoded === '..') {
      throw new ScalekitValidationError(
        'path must not contain "." or ".." segments'
      );
    }
  }
  return normalized;
}

/**
 * Whether `{envUrl}/proxy{path}`, as the URL parser resolves it, stays under
 * the environment's `/proxy/` (same origin, same path prefix).
 *
 * @internal
 */
export function resolvesInsideProxy(envUrl: string, path: string): boolean {
  const base = envUrl.replace(/\/$/, '');
  try {
    const root = new URL(`${base}/proxy/`);
    const target = new URL(`${base}/proxy${path}`);
    return (
      target.origin === root.origin && target.pathname.startsWith(root.pathname)
    );
  } catch {
    return false;
  }
}

function isAsyncIterable(value: unknown): value is AsyncIterable<Uint8Array> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as { [Symbol.asyncIterator]?: unknown })[
      Symbol.asyncIterator
    ] === 'function'
  );
}

/**
 * Checks every argument before any network call.
 *
 * @internal
 */
export function validateUploadParams(
  params: ResumableUploadParams,
  options: ResumableUploadOptions | undefined
): UploadPlan {
  if (params === null || typeof params !== 'object') {
    throw new ScalekitValidationError('params is required');
  }
  const connectionName = requireHeaderValue(
    'connectionName',
    params.connectionName
  );
  const identifier = requireHeaderValue('identifier', params.identifier);
  const path = validatePath(requireNonEmptyString('path', params.path));

  const rawMethod = params.method ?? 'POST';
  const method = typeof rawMethod === 'string' ? rawMethod.toUpperCase() : '';
  if (!UPLOAD_METHODS.has(method)) {
    throw new ScalekitValidationError(
      `method must be POST, PUT or PATCH, got ${String(rawMethod)}`
    );
  }

  let contentType = DEFAULT_CONTENT_TYPE;
  if (params.contentType !== undefined) {
    contentType = requireHeaderValue('contentType', params.contentType);
  }

  let metadataJson: string | undefined;
  if (params.metadata !== undefined) {
    if (!isPlainObject(params.metadata)) {
      throw new ScalekitValidationError('metadata must be a plain object');
    }
    try {
      metadataJson = JSON.stringify(params.metadata);
    } catch (error) {
      throw new ScalekitValidationError(
        `metadata must be JSON-serializable: ${(error as Error).message}`
      );
    }
  }

  const queryParams: Record<string, string | number | boolean> = {};
  if (params.queryParams !== undefined) {
    if (!isPlainObject(params.queryParams)) {
      throw new ScalekitValidationError('queryParams must be a plain object');
    }
    for (const [key, value] of Object.entries(params.queryParams)) {
      if (key === 'uploadType') {
        throw new ScalekitValidationError(
          'queryParams must not set uploadType; the SDK always sends uploadType=resumable'
        );
      }
      if (
        typeof value !== 'string' &&
        typeof value !== 'boolean' &&
        !(typeof value === 'number' && Number.isFinite(value))
      ) {
        throw new ScalekitValidationError(
          `queryParams.${key} must be a string, a finite number or a boolean`
        );
      }
      queryParams[key] = value;
    }
  }

  const chunkSize = params.chunkSize ?? DEFAULT_CHUNK_SIZE;
  if (
    !Number.isSafeInteger(chunkSize) ||
    chunkSize <= 0 ||
    chunkSize % CHUNK_GRANULARITY !== 0
  ) {
    throw new ScalekitValidationError(
      `chunkSize must be a positive multiple of ${CHUNK_GRANULARITY} (256 KiB), got ${String(chunkSize)}`
    );
  }

  const { data } = params;
  const isBytes = data instanceof Uint8Array;
  if (!isBytes && !isAsyncIterable(data)) {
    throw new ScalekitValidationError(
      'data must be a Uint8Array/Buffer or an async iterable of Uint8Array (for example fs.createReadStream(path))'
    );
  }
  let totalBytes = params.totalBytes;
  if (totalBytes !== undefined && !isNonNegativeSafeInteger(totalBytes)) {
    throw new ScalekitValidationError(
      `totalBytes must be a non-negative integer, got ${String(totalBytes)}`
    );
  }
  if (isBytes) {
    if (totalBytes !== undefined && totalBytes !== data.byteLength) {
      throw new ScalekitValidationError(
        `totalBytes (${totalBytes}) does not match data.byteLength (${data.byteLength})`
      );
    }
    totalBytes = data.byteLength;
  }

  const timeoutMs = options?.timeoutMs;
  if (
    timeoutMs !== undefined &&
    (typeof timeoutMs !== 'number' ||
      !Number.isFinite(timeoutMs) ||
      timeoutMs <= 0)
  ) {
    throw new ScalekitValidationError(
      `timeoutMs must be a positive finite number of milliseconds, got ${String(timeoutMs)}`
    );
  }
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  if (!isNonNegativeSafeInteger(maxRetries)) {
    throw new ScalekitValidationError(
      `maxRetries must be a non-negative integer, got ${String(maxRetries)}`
    );
  }
  const onProgress = options?.onProgress;
  if (onProgress !== undefined && typeof onProgress !== 'function') {
    throw new ScalekitValidationError('onProgress must be a function');
  }

  return {
    connectionName,
    identifier,
    path,
    method,
    contentType,
    metadataJson,
    queryParams,
    chunkSize,
    totalBytes,
    data,
    timeoutMs,
    maxRetries,
    onProgress,
    signal: options?.signal,
  };
}

/**
 * Size of an unread `fs.createReadStream(path)` that reads the whole file,
 * or `undefined` when it can't be known up front.
 */
async function sizeOfFileStream(data: unknown): Promise<number | undefined> {
  if (!(data instanceof ReadStream)) return undefined;
  const stream = data as ReadStream & { start?: number; end?: number };
  if (
    typeof stream.path !== 'string' ||
    stream.start !== undefined ||
    (stream.end !== undefined && stream.end !== Infinity) ||
    stream.bytesRead !== 0
  ) {
    return undefined;
  }
  try {
    const stats = await fsPromises.stat(stream.path);
    return stats.isFile() ? stats.size : undefined;
  } catch {
    // The stream reports the same failure when it is read.
    return undefined;
  }
}

/**
 * Full-jitter exponential backoff for the n-th retry (n starts at 0).
 *
 * @internal
 */
export function backoffDelayMs(
  retry: number,
  random: () => number = Math.random
): number {
  return random() * Math.min(BACKOFF_CAP_MS, BACKOFF_BASE_MS * 2 ** retry);
}

/**
 * Delay requested by a `Retry-After` header (delta-seconds or HTTP-date),
 * capped at 30 s. A past date or negative value means 0; an unparseable
 * value returns `undefined` so the caller falls back to backoff.
 *
 * @internal
 */
export function retryAfterDelayMs(
  value: string | undefined,
  now: number = Date.now()
): number | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  let delayMs: number;
  if (/^-?\d+$/.test(trimmed)) {
    delayMs = Number(trimmed) * 1000;
  } else if (/[a-z]/i.test(trimmed) && !Number.isNaN(Date.parse(trimmed))) {
    delayMs = Date.parse(trimmed) - now;
  } else {
    return undefined;
  }
  return Math.min(Math.max(delayMs, 0), RETRY_AFTER_CAP_MS);
}

function toBuffer(bytes: Uint8Array): Buffer {
  // A non-Buffer view must be wrapped: axios would otherwise send the whole
  // underlying ArrayBuffer instead of the view.
  return Buffer.isBuffer(bytes)
    ? bytes
    : Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

interface Chunk {
  /** Offset of the first byte. */
  start: number;
  bytes: Buffer;
  /** Whether this chunk ends the content. */
  final: boolean;
}

/**
 * Reads the content one chunk at a time. For a stream it reads one byte past
 * each chunk, so it knows whether a chunk is the last before sending it, and
 * a stream longer than `totalBytes` is caught before its last chunk goes out.
 */
class ChunkSource {
  private readonly pieces: Uint8Array[] = [];
  private buffered = 0;
  private consumed = 0;
  private ended = false;
  private iterator: AsyncIterator<unknown> | undefined;

  constructor(
    private readonly data: Uint8Array | AsyncIterable<Uint8Array>,
    private readonly chunkSize: number,
    private readonly declaredTotal: number | undefined,
    private readonly checkAbort: () => void
  ) {}

  /** The total size: declared up front, or known once the end was read. */
  get totalBytes(): number | undefined {
    if (this.declaredTotal !== undefined) return this.declaredTotal;
    return this.ended && this.buffered === 0 ? this.consumed : undefined;
  }

  async next(): Promise<Chunk> {
    const start = this.consumed;
    if (this.data instanceof Uint8Array) {
      const end = Math.min(start + this.chunkSize, this.data.byteLength);
      this.consumed = end;
      this.ended = end === this.data.byteLength;
      return {
        start,
        bytes: toBuffer(this.data.subarray(start, end)),
        final: this.ended,
      };
    }
    await this.fill(this.chunkSize + 1);
    const take = Math.min(this.chunkSize, this.buffered);
    const final = this.ended && this.buffered <= this.chunkSize;
    const bytes = this.take(take);
    this.consumed += take;
    const declared = this.declaredTotal;
    if (declared !== undefined) {
      if (this.consumed > declared || (!final && this.consumed === declared)) {
        throw new ScalekitValidationError(
          `data is longer than totalBytes (${declared})`
        );
      }
      if (final && this.consumed < declared) {
        throw new ScalekitValidationError(
          `data ended after ${this.consumed} bytes, shorter than totalBytes (${declared})`
        );
      }
    }
    return { start, bytes, final };
  }

  /** Releases the caller's stream if it was not read to the end. */
  async close(): Promise<void> {
    if (this.iterator && !this.ended && this.iterator.return) {
      try {
        await this.iterator.return();
      } catch {
        // Cleanup must not replace the error that ended the upload.
      }
    }
  }

  private async fill(target: number): Promise<void> {
    if (!this.iterator) {
      this.iterator = (this.data as AsyncIterable<unknown>)[
        Symbol.asyncIterator
      ]();
    }
    while (!this.ended && this.buffered < target) {
      const result = await this.iterator.next();
      this.checkAbort();
      if (result.done) {
        this.ended = true;
        break;
      }
      const piece = result.value;
      if (!(piece instanceof Uint8Array)) {
        throw new ScalekitValidationError(
          `data yielded a ${typeof piece}, not bytes; read streams without an encoding`
        );
      }
      if (piece.byteLength > 0) {
        this.pieces.push(piece);
        this.buffered += piece.byteLength;
      }
    }
  }

  private take(count: number): Buffer {
    const parts: Uint8Array[] = [];
    let needed = count;
    while (needed > 0) {
      const head = this.pieces[0];
      if (head === undefined) break; // unreachable: count <= buffered
      if (head.byteLength <= needed) {
        parts.push(head);
        this.pieces.shift();
        needed -= head.byteLength;
      } else {
        parts.push(head.subarray(0, needed));
        this.pieces[0] = head.subarray(needed);
        needed = 0;
      }
    }
    this.buffered -= count;
    const [only] = parts;
    return parts.length === 1 && only !== undefined
      ? toBuffer(only)
      : Buffer.concat(parts, count);
  }
}

type Exchange =
  | { kind: 'response'; response: AxiosResponse }
  | { kind: 'http-error'; response: AxiosResponse; error: AxiosError }
  | { kind: 'timeout'; error: unknown }
  | { kind: 'network'; error: unknown };

function headerRecord(headers: unknown): Record<string, string> {
  const record: Record<string, string> = {};
  if (!headers || typeof headers !== 'object') return record;
  const plain =
    headers instanceof AxiosHeaders
      ? (headers.toJSON() as Record<string, unknown>)
      : (headers as Record<string, unknown>);
  for (const [name, value] of Object.entries(plain)) {
    if (value === undefined || value === null) continue;
    record[name.toLowerCase()] = Array.isArray(value)
      ? value.map(String).join(', ')
      : String(value);
  }
  return record;
}

function bodyText(data: unknown): string {
  if (data === undefined || data === null) return '';
  if (typeof data === 'string') return data;
  if (data instanceof Uint8Array) return Buffer.from(data).toString('utf8');
  return JSON.stringify(data);
}

function isJsonContentType(headers: Record<string, string>): boolean {
  const [mime = ''] = (headers['content-type'] ?? '').split(';');
  const type = mime.trim().toLowerCase();
  return type === 'application/json' || type.endsWith('+json');
}

/** Error body for callers: parsed JSON when it is JSON, otherwise the text. */
function errorBody(response: AxiosResponse): unknown {
  if (
    response.data !== null &&
    typeof response.data === 'object' &&
    !(response.data instanceof Uint8Array)
  ) {
    return response.data;
  }
  const text = bodyText(response.data);
  if (text.trim() === '') return text;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/**
 * A 401 the Scalekit proxy itself sent because the access token was rejected
 * (JSON `{ "detail": ..., "code": "UNAUTHORIZED" }`), as opposed to a 401 from
 * the provider. Only this kind is safe to resend after a token refresh.
 */
function isScalekitUnauthorized(response: AxiosResponse): boolean {
  if (response.status !== 401) return false;
  if (!isJsonContentType(headerRecord(response.headers))) return false;
  const body = errorBody(response);
  if (!isPlainObject(body)) return false;
  const keys = Object.keys(body).sort();
  return (
    keys.length === 2 &&
    keys[0] === 'code' &&
    keys[1] === 'detail' &&
    body.code === 'UNAUTHORIZED'
  );
}

function setCause<T extends Error>(error: T, cause: unknown): T {
  Object.defineProperty(error, 'cause', {
    value: cause,
    writable: true,
    configurable: true,
    enumerable: false,
  });
  return error;
}

/** Maps a failed token request the same way `actions.request` maps failures. */
function tokenRequestError(error: unknown): ScalekitException {
  if (error instanceof ScalekitException) return error;
  if (error instanceof AxiosError) {
    if (error.response) {
      return setCause(ScalekitServerException.promote(error.response), error);
    }
    if (ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
      return setCause(
        ScalekitGatewayTimeoutException.fromAxiosTimeout(error),
        error
      );
    }
  }
  return setCause(new ScalekitException(error), error);
}

class ResumableUpload {
  private uploadId: string | undefined;
  private committed = 0;

  constructor(
    private readonly core: CoreClient,
    private readonly plan: UploadPlan
  ) {}

  async run(): Promise<Record<string, unknown>> {
    const { plan } = this;
    this.assertUrlInsideProxy();
    this.checkAbort();
    const declaredTotal =
      plan.totalBytes ?? (await sizeOfFileStream(plan.data));
    const source = new ChunkSource(
      plan.data,
      plan.chunkSize,
      declaredTotal,
      () => this.checkAbort()
    );
    try {
      // Read the first chunk before starting the session, so content that
      // fits in one chunk has a known size for X-Upload-Content-Length.
      let chunk = await source.next();
      try {
        await this.core.ensureAccessToken();
      } catch (error) {
        throw tokenRequestError(error);
      }
      this.checkAbort();
      this.uploadId = await this.startSession(source.totalBytes);
      return await this.transfer(source, chunk);
    } finally {
      await source.close();
    }
  }

  private proxyUrl(): string {
    return `${this.core.envUrl.replace(/\/$/, '')}/proxy${this.plan.path}`;
  }

  /** Second line of defence behind `validatePath`; see `resolvesInsideProxy`. */
  private assertUrlInsideProxy(): void {
    if (!resolvesInsideProxy(this.core.envUrl, this.plan.path)) {
      throw new ScalekitValidationError(
        'path must resolve to a location under the proxy'
      );
    }
  }

  private proxyHeaders(): Record<string, string> {
    return {
      connection_name: this.plan.connectionName,
      identifier: this.plan.identifier,
    };
  }

  private async startSession(total: number | undefined): Promise<string> {
    const { plan } = this;
    const headers: Record<string, string | false> = {
      ...this.proxyHeaders(),
      'X-Upload-Content-Type': plan.contentType,
      // No body, so no Content-Type (axios would otherwise add a form one).
      'Content-Type': false,
    };
    if (total !== undefined) headers['X-Upload-Content-Length'] = String(total);
    let body = Buffer.alloc(0);
    if (plan.metadataJson !== undefined) {
      headers['Content-Type'] = 'application/json; charset=UTF-8';
      body = Buffer.from(plan.metadataJson, 'utf8');
    }
    const outcome = await this.exchange({
      url: this.proxyUrl(),
      method: plan.method,
      params: { uploadType: 'resumable', ...plan.queryParams },
      headers,
      data: body,
    });

    switch (outcome.kind) {
      case 'response': {
        const { response } = outcome;
        if (response.status === 308) {
          throw this.protocolError(
            'the session-start request returned 308 instead of 2xx',
            response
          );
        }
        const location = headerRecord(response.headers)['location'];
        let uploadId: string | null = null;
        if (location) {
          try {
            uploadId = new URL(
              location,
              'https://upload.invalid'
            ).searchParams.get('upload_id');
          } catch {
            uploadId = null;
          }
        }
        if (!uploadId) {
          throw this.protocolError(
            'the session-start response has no upload_id in its Location header',
            response
          );
        }
        return uploadId;
      }
      case 'http-error':
        if (outcome.response.status >= 300 && outcome.response.status < 400) {
          throw this.protocolError(
            `the session-start request returned a ${outcome.response.status} redirect`,
            outcome.response,
            outcome.error
          );
        }
        throw this.httpError(outcome, 'session-start request');
      case 'timeout':
        throw this.timeoutError(outcome.error, 'session-start request');
      case 'network':
        throw this.connectionError(outcome.error, 'session-start request');
    }
  }

  private async transfer(
    source: ChunkSource,
    firstChunk: Chunk
  ): Promise<Record<string, unknown>> {
    let chunk = firstChunk;
    let failures = 0;
    let needStatusQuery = false;
    let finalChunkSent = false;
    // Highest offset the server has confirmed. Only a new high counts as
    // progress, so a server bouncing between offsets still runs out of retries.
    let highWater = this.committed;

    for (;;) {
      this.checkAbort();
      const chunkEnd = chunk.start + chunk.bytes.length;
      if (!needStatusQuery && this.committed === chunkEnd && !chunk.final) {
        chunk = await source.next();
        continue;
      }

      const isStatusQuery: boolean = needStatusQuery;
      const what = isStatusQuery ? 'status request' : 'chunk request';
      if (!isStatusQuery && chunk.final) finalChunkSent = true;
      const outcome: Exchange = isStatusQuery
        ? await this.sendStatusQuery(source.totalBytes)
        : await this.sendChunk(chunk, source.totalBytes);

      if (outcome.kind === 'response') {
        const { response } = outcome;
        if (response.status === 200 || response.status === 201) {
          if (!finalChunkSent) {
            // Never return a file the server completed with bytes missing.
            throw this.protocolError(
              'the server completed the upload before the last chunk was sent',
              response
            );
          }
          return this.complete(response, source.totalBytes ?? chunkEnd);
        }
        if (response.status !== 308) {
          throw this.httpError({ response }, what);
        }
        const next = this.committedOffset(response);
        if (next < chunk.start || next > chunkEnd) {
          throw this.protocolError(
            `the server reported ${next} bytes committed, outside the current chunk (${chunk.start}-${chunkEnd})`,
            response
          );
        }
        if (chunk.final && next === chunkEnd) {
          throw this.protocolError(
            'the server confirmed every byte but did not complete the upload',
            response
          );
        }
        needStatusQuery = false;
        this.committed = next;
        if (next > highWater) {
          highWater = next;
          failures = 0;
          await this.reportProgress(source.totalBytes);
          continue;
        }
        // A status query reporting no new bytes: resend from that offset.
        if (isStatusQuery) continue;
        // A 308 to a chunk that commits no new bytes falls through and is
        // retried like a failure.
      } else if (outcome.kind === 'http-error') {
        const { status } = outcome.response;
        if (SESSION_GONE_STATUSES.has(status)) {
          throw this.httpError(outcome, what, true);
        }
        if (status >= 300 && status < 400) {
          throw this.protocolError(
            `unexpected ${status} redirect to a ${what}`,
            outcome.response,
            outcome.error
          );
        }
        if (!RETRYABLE_STATUSES.has(status)) {
          throw this.httpError(outcome, what);
        }
      }

      failures += 1;
      if (failures > this.plan.maxRetries) {
        if (outcome.kind === 'response') {
          throw this.protocolError(
            `the server committed no new bytes after ${failures} attempts`,
            outcome.response
          );
        }
        if (outcome.kind === 'http-error') throw this.httpError(outcome, what);
        if (outcome.kind === 'timeout') {
          throw this.timeoutError(outcome.error, what);
        }
        throw this.connectionError(outcome.error, what);
      }
      const retryAfter =
        outcome.kind === 'http-error' &&
        (outcome.response.status === 429 || outcome.response.status === 503)
          ? retryAfterDelayMs(
              headerRecord(outcome.response.headers)['retry-after']
            )
          : undefined;
      await this.sleep(retryAfter ?? backoffDelayMs(failures - 1));
      // After a stall the 308 already said where to resume; otherwise ask.
      needStatusQuery = outcome.kind !== 'response';
    }
  }

  private sendChunk(
    chunk: Chunk,
    total: number | undefined
  ): Promise<Exchange> {
    const offset = this.committed;
    const body = chunk.bytes.subarray(offset - chunk.start);
    const totalField = chunk.final
      ? String(chunk.start + chunk.bytes.length)
      : total !== undefined
        ? String(total)
        : '*';
    const range =
      body.length === 0
        ? `bytes */${totalField}`
        : `bytes ${offset}-${offset + body.length - 1}/${totalField}`;
    return this.exchange({
      url: this.proxyUrl(),
      method: 'PUT',
      params: { uploadType: 'resumable', upload_id: this.uploadId },
      headers: {
        ...this.proxyHeaders(),
        'Content-Type': this.plan.contentType,
        'Content-Range': range,
      },
      data: body,
    });
  }

  private sendStatusQuery(total: number | undefined): Promise<Exchange> {
    return this.exchange({
      url: this.proxyUrl(),
      method: 'PUT',
      params: { uploadType: 'resumable', upload_id: this.uploadId },
      headers: {
        ...this.proxyHeaders(),
        'Content-Type': false,
        'Content-Range': `bytes */${total !== undefined ? String(total) : '*'}`,
      },
      data: Buffer.alloc(0),
    });
  }

  /**
   * Sends one request. A Scalekit 401 (rejected access token) is answered by
   * one token refresh and one resend, and only when the token changed; the
   * proxy rejects such a request before forwarding it, so the resend is safe.
   */
  private async exchange(config: AxiosRequestConfig): Promise<Exchange> {
    const tokenUsed = this.core.accessToken;
    const outcome = await this.send(config);
    if (
      outcome.kind === 'http-error' &&
      isScalekitUnauthorized(outcome.response)
    ) {
      try {
        await this.core.refreshAccessToken(tokenUsed);
      } catch (error) {
        throw tokenRequestError(error);
      }
      this.checkAbort();
      if (this.core.accessToken && this.core.accessToken !== tokenUsed) {
        return this.send(config);
      }
    }
    return outcome;
  }

  private async send(config: AxiosRequestConfig): Promise<Exchange> {
    const { plan } = this;
    try {
      const response = await this.core.axios.request({
        ...config,
        timeout: plan.timeoutMs ?? this.core.toolTimeoutMs,
        ...(plan.signal !== undefined && { signal: plan.signal }),
        maxRedirects: 0,
        maxBodyLength: Infinity,
        responseType: 'text',
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 308,
      });
      return { kind: 'response', response };
    } catch (error) {
      if (isCancel(error) || plan.signal?.aborted) {
        throw this.abortError();
      }
      if (error instanceof AxiosError) {
        if (error.response) {
          return { kind: 'http-error', response: error.response, error };
        }
        if (ScalekitGatewayTimeoutException.isAxiosTimeout(error)) {
          return { kind: 'timeout', error };
        }
      }
      return { kind: 'network', error };
    }
  }

  /** Bytes committed according to a 308's `Range: bytes=0-N` header. */
  private committedOffset(response: AxiosResponse): number {
    const range = headerRecord(response.headers)['range'];
    if (range === undefined || range === '') return 0;
    const match = /^bytes=0-(\d+)$/.exec(range.trim());
    const last = match ? Number(match[1]) : NaN;
    if (!Number.isSafeInteger(last)) {
      throw this.protocolError(`malformed Range header "${range}"`, response);
    }
    return last + 1;
  }

  private async complete(
    response: AxiosResponse,
    total: number
  ): Promise<Record<string, unknown>> {
    let resource: unknown;
    if (
      response.data !== null &&
      typeof response.data === 'object' &&
      !(response.data instanceof Uint8Array)
    ) {
      resource = response.data;
    } else {
      const text = bodyText(response.data);
      if (text.trim() === '') {
        resource = {};
      } else {
        try {
          resource = JSON.parse(text) as unknown;
        } catch (error) {
          throw this.protocolError(
            'the final response body is not JSON',
            response,
            error
          );
        }
      }
    }
    if (!isPlainObject(resource)) {
      throw this.protocolError(
        'the final response body is not a JSON object',
        response
      );
    }
    this.committed = total;
    await this.reportProgress(total);
    return resource;
  }

  private async reportProgress(total: number | undefined): Promise<void> {
    if (!this.plan.onProgress) return;
    await this.plan.onProgress(
      Object.freeze({ bytesCommitted: this.committed, totalBytes: total })
    );
  }

  private sleep(ms: number): Promise<void> {
    const { signal } = this.plan;
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(this.abortError());
        return;
      }
      const onAbort = (): void => {
        clearTimeout(timer);
        reject(this.abortError());
      };
      const timer = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  }

  private checkAbort(): void {
    if (this.plan.signal?.aborted) throw this.abortError();
  }

  private abortError(): ScalekitAbortError {
    return new ScalekitAbortError(
      'The upload was aborted',
      this.plan.signal?.reason
    );
  }

  private httpError(
    outcome: { response: AxiosResponse; error?: AxiosError },
    what: string,
    sessionGone = false
  ): ScalekitUploadHttpException {
    const { response, error } = outcome;
    const init = {
      message: sessionGone
        ? `The upload session expired or no longer exists (HTTP ${response.status} on the ${what}); upload the file again`
        : `The upload failed with HTTP ${response.status} on the ${what}`,
      status: response.status,
      statusText:
        typeof response.statusText === 'string' ? response.statusText : '',
      headers: headerRecord(response.headers),
      body: errorBody(response),
      uploadId: this.uploadId,
      bytesCommitted: this.committed,
      cause: error,
    };
    return sessionGone
      ? new ScalekitUploadSessionExpiredException(init)
      : new ScalekitUploadHttpException(init);
  }

  private timeoutError(
    error: unknown,
    what: string
  ): ScalekitUploadTimeoutException {
    return new ScalekitUploadTimeoutException({
      message: `The ${what} timed out`,
      uploadId: this.uploadId,
      bytesCommitted: this.committed,
      cause: error,
    });
  }

  private connectionError(
    error: unknown,
    what: string
  ): ScalekitUploadConnectionException {
    const code = (error as { code?: unknown } | null)?.code;
    return new ScalekitUploadConnectionException({
      message: `The ${what} failed with no response${typeof code === 'string' ? ` (${code})` : ''}`,
      uploadId: this.uploadId,
      bytesCommitted: this.committed,
      cause: error,
    });
  }

  private protocolError(
    message: string,
    response: AxiosResponse,
    cause?: unknown
  ): ScalekitUploadProtocolException {
    return new ScalekitUploadProtocolException({
      message: `Unexpected upload response: ${message}`,
      uploadId: this.uploadId,
      bytesCommitted: this.committed,
      status: response.status,
      headers: headerRecord(response.headers),
      body: errorBody(response),
      cause,
    });
  }
}

/**
 * Uploads content with Google's resumable protocol through the Scalekit
 * proxy. See `ActionsClient.uploadResumable` for the contract.
 *
 * @internal
 */
export async function uploadResumable(
  core: CoreClient,
  params: ResumableUploadParams,
  options?: ResumableUploadOptions
): Promise<Record<string, unknown>> {
  const plan = validateUploadParams(params, options);
  return new ResumableUpload(core, plan).run();
}
