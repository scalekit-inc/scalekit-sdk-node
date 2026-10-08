import { Code, ConnectError } from '@connectrpc/connect';
import type { AxiosResponse } from 'axios';
import { ScalekitException, ScalekitServerException } from './base-exception';
import { ScalekitGatewayTimeoutException } from './specific-exceptions';

// Errors raised by `actions.uploadResumable`. Every one of them carries
// `uploadId` (undefined when the session was never started) and
// `bytesCommitted` (the bytes the server has confirmed), so a caller can log
// how far the upload got. None of them carries the access token.

/** HTTP statuses after which retrying the same upload may succeed. */
const RETRYABLE_UPLOAD_STATUSES: ReadonlySet<number> = new Set([
  408, 429, 500, 502, 503, 504,
]);

function defineCause(target: Error, cause: unknown): void {
  Object.defineProperty(target, 'cause', {
    value: cause,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

function defineMessage(target: Error, message: string): void {
  Object.defineProperty(target, 'message', {
    value: message,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

/**
 * An upload request got an HTTP error response.
 *
 * Raised when the session-start request fails (then `uploadId` is
 * `undefined`), when a chunk gets a 4xx other than 404/410 or a 2xx other
 * than 200/201, and when a
 * retryable status (408, 429, 500, 502, 503, 504) is still failing after
 * `maxRetries` retries. `status` is the real HTTP status; `httpStatus`
 * returns the same value.
 */
export class ScalekitUploadHttpException extends ScalekitServerException {
  /** Upload session ID, or `undefined` when the session-start request failed. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** HTTP status of the failed response. */
  readonly status: number;
  /** Response headers, with lower-case names. */
  readonly headers: Readonly<Record<string, string>>;
  /** Response body: parsed JSON when it is JSON, otherwise the text. */
  readonly body: unknown;
  /** Whether a new attempt at the whole upload may succeed (408, 429 and 5xx). */
  readonly retryable: boolean;
  /** The underlying transport error. */
  declare readonly cause: unknown;

  /** @internal */
  constructor(init: {
    message: string;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: unknown;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  }) {
    // A minimal response, so the base class keeps no request config.
    super({
      status: init.status,
      statusText: init.statusText,
      headers: init.headers,
      data: init.body,
      config: {},
    } as AxiosResponse);
    this.name = 'ScalekitUploadHttpException';
    defineMessage(this, init.message);
    defineCause(this, init.cause);
    this.uploadId = init.uploadId;
    this.bytesCommitted = init.bytesCommitted;
    this.status = init.status;
    this.headers = init.headers;
    this.body = init.body;
    this.retryable = RETRYABLE_UPLOAD_STATUSES.has(init.status);
  }

  /** The HTTP status of the failed response (same as `status`). */
  override get httpStatus(): number {
    return this.status;
  }

  override toString(): string {
    return `${this.name}: ${this.message}`;
  }
}

/**
 * The upload session no longer exists: a chunk or status request got 404 or
 * 410. Google upload sessions expire after about a week. The SDK does not
 * start a new session on its own; call `uploadResumable` again to upload
 * from the beginning.
 */
export class ScalekitUploadSessionExpiredException extends ScalekitUploadHttpException {
  /** @internal */
  constructor(
    init: ConstructorParameters<typeof ScalekitUploadHttpException>[0]
  ) {
    super(init);
    this.name = 'ScalekitUploadSessionExpiredException';
  }
}

/**
 * The server's response broke the resumable-upload protocol: no `upload_id`
 * in the session-start response, a malformed or out-of-range `Range` header,
 * an unexpected redirect, a completed upload before the last chunk was sent
 * (so a truncated file is never returned), a chunk that still commits no new
 * bytes after `maxRetries` retries, or a final response body that is not a
 * JSON object.
 */
export class ScalekitUploadProtocolException extends ScalekitException {
  /** Upload session ID, or `undefined` when the session was not started. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** HTTP status of the offending response, when there was one. */
  readonly status: number | undefined;
  /** Headers of the offending response, when there was one. */
  readonly headers: Readonly<Record<string, string>> | undefined;
  /** Body of the offending response, when there was one. */
  readonly body: unknown;
  /** Always `false`. */
  readonly retryable: boolean;
  declare readonly cause: unknown;

  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    status?: number;
    headers?: Record<string, string>;
    body?: unknown;
    cause?: unknown;
  }) {
    super(init.message);
    this.name = 'ScalekitUploadProtocolException';
    defineCause(this, init.cause);
    this.uploadId = init.uploadId;
    this.bytesCommitted = init.bytesCommitted;
    this.status = init.status;
    this.headers = init.headers;
    this.body = init.body;
    this.retryable = false;
  }
}

/**
 * An upload request timed out. On a chunk this is raised only after
 * `maxRetries` retries; the session-start request is never retried.
 * Extends `ScalekitGatewayTimeoutException`, the type other SDK calls raise
 * on a timeout.
 */
export class ScalekitUploadTimeoutException extends ScalekitGatewayTimeoutException {
  /** Upload session ID, or `undefined` when the session-start request timed out. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** Always `true`. */
  readonly retryable: boolean;
  declare readonly cause: unknown;

  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  }) {
    super(new ConnectError(init.message, Code.DeadlineExceeded));
    this.name = 'ScalekitUploadTimeoutException';
    defineMessage(this, init.message);
    defineCause(this, init.cause);
    this.uploadId = init.uploadId;
    this.bytesCommitted = init.bytesCommitted;
    this.retryable = true;
  }

  override toString(): string {
    return `${this.name}: ${this.message}`;
  }
}

/**
 * An upload request got no response (connection refused or reset, DNS
 * failure). On a chunk this is raised only after `maxRetries` retries; the
 * session-start request is never retried.
 */
export class ScalekitUploadConnectionException extends ScalekitException {
  /** Upload session ID, or `undefined` when the session-start request failed. */
  readonly uploadId: string | undefined;
  /** Bytes the server had confirmed before the error. */
  readonly bytesCommitted: number;
  /** Always `true`. */
  readonly retryable: boolean;
  declare readonly cause: unknown;

  /** @internal */
  constructor(init: {
    message: string;
    uploadId: string | undefined;
    bytesCommitted: number;
    cause?: unknown;
  }) {
    super(init.message);
    this.name = 'ScalekitUploadConnectionException';
    defineCause(this, init.cause);
    this.uploadId = init.uploadId;
    this.bytesCommitted = init.bytesCommitted;
    this.retryable = true;
  }
}
