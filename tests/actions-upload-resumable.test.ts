/**
 * Unit tests for actions.uploadResumable. No network and no credentials: the
 * axios adapter is replaced by a fake of the proxy + Google's resumable
 * protocol, so the SDK's real request interceptors (auth, SDK headers, error
 * scrubbing), validateStatus and request/response transforms all run.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import { inspect } from 'util';
import {
  AxiosError,
  CanceledError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import ScalekitClient from '../src/scalekit';
import type CoreClient from '../src/core';
import {
  ScalekitAbortError,
  ScalekitException,
  ScalekitGatewayTimeoutException,
  ScalekitServerException,
  ScalekitUploadConnectionException,
  ScalekitUploadHttpException,
  ScalekitUploadProtocolException,
  ScalekitUploadSessionExpiredException,
  ScalekitUploadTimeoutException,
  ScalekitValidationError,
  type ResumableUploadParams,
  type UploadProgress,
} from '../src';
import {
  backoffDelayMs,
  resolvesInsideProxy,
  retryAfterDelayMs,
} from '../src/resumable-upload';

const KIB = 1024;
const CHUNK = 256 * KIB;
const ENV_URL = 'https://test.scalekit.dev';
const UPLOAD_PATH = '/upload/drive/v3/files';
const UPLOAD_ID = 'up_123';

// ---------------------------------------------------------------------------
// Fake transport
// ---------------------------------------------------------------------------

interface SeenRequest {
  method: string;
  url: string;
  params: Record<string, unknown>;
  headers: Record<string, string>;
  body: Buffer;
  config: InternalAxiosRequestConfig;
}

type Reply =
  | { status: number; headers?: Record<string, string>; body?: string }
  | { fail: 'timeout' | 'reset' };

/** Request handler; `next` is the fake Google server's own answer. */
type Fault = (req: SeenRequest, next: () => Reply) => Reply | Promise<Reply>;

function lowerHeaders(config: InternalAxiosRequestConfig) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(config.headers.toJSON())) {
    if (v !== undefined && v !== null) {
      out[k.toLowerCase()] = String(v);
    }
  }
  return out;
}

function bodyOf(data: unknown): Buffer {
  if (data === undefined || data === null) return Buffer.alloc(0);
  if (Buffer.isBuffer(data)) return data;
  if (typeof data === 'string') return Buffer.from(data);
  throw new Error(`unexpected request body type ${typeof data}`);
}

/**
 * A stateful fake of Google's resumable protocol behind the proxy. It checks
 * every Content-Range against what it has, so a wrong offset fails loudly.
 */
class FakeGoogle {
  received = Buffer.alloc(0);
  total: number | undefined;
  starts = 0;
  /** Commit at most this many bytes of the next chunk (then reset). */
  partialCommit: number | undefined;
  finalBody: string | undefined;
  finalStatus = 200;

  handle(req: SeenRequest): Reply {
    if (req.method !== 'PUT' || !req.params.upload_id) {
      this.starts += 1;
      return {
        status: 200,
        headers: {
          location: `https://www.googleapis.com${UPLOAD_PATH}?uploadType=resumable&upload_id=${UPLOAD_ID}`,
        },
      };
    }
    expect(req.params).toEqual({
      uploadType: 'resumable',
      upload_id: UPLOAD_ID,
    });
    const range = req.headers['content-range'];
    const status = /^bytes \*\/(\d+|\*)$/.exec(range);
    if (status) {
      expect(req.body.length).toBe(0);
      if (status[1] !== '*') this.total = Number(status[1]);
      return this.state();
    }
    const m = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(range);
    if (!m) return { status: 400, body: `bad Content-Range ${range}` };
    const [start, end] = [Number(m[1]), Number(m[2])];
    if (start !== this.received.length) {
      return {
        status: 400,
        body: `offset ${start} != ${this.received.length}`,
      };
    }
    expect(req.body.length).toBe(end - start + 1);
    if (m[3] !== '*') this.total = Number(m[3]);
    let take = req.body.length;
    if (this.partialCommit !== undefined) {
      take = Math.min(take, this.partialCommit);
      this.partialCommit = undefined;
    }
    this.received = Buffer.concat([this.received, req.body.subarray(0, take)]);
    return this.state();
  }

  private state(): Reply {
    if (this.total !== undefined && this.received.length === this.total) {
      return {
        status: this.finalStatus,
        headers: { 'content-type': 'application/json; charset=UTF-8' },
        body:
          this.finalBody ??
          JSON.stringify({ id: 'file_1', size: String(this.total) }),
      };
    }
    return this.received.length === 0
      ? { status: 308 }
      : {
          status: 308,
          headers: { range: `bytes=0-${this.received.length - 1}` },
        };
  }
}

interface Harness {
  client: ScalekitClient;
  core: CoreClient;
  google: FakeGoogle;
  /** Every request, token requests included. */
  seen: SeenRequest[];
  /** Proxy requests only. */
  proxied: () => SeenRequest[];
  tokenCalls: () => number;
  setFault: (fault: Fault | undefined) => void;
}

const isTokenRequest = (r: SeenRequest) => r.url.endsWith('oauth/token');

function makeHarness(opts: { token?: string | null } = {}): Harness {
  const client = new ScalekitClient(ENV_URL, 'client_id', 'client_secret');
  const core = (client as unknown as { coreClient: CoreClient }).coreClient;
  if (opts.token !== null) core.accessToken = opts.token ?? 'token-1';
  const google = new FakeGoogle();
  const seen: SeenRequest[] = [];
  let fault: Fault | undefined;
  let tokenCount = 0;

  core.axios.defaults.adapter = async (config) => {
    const req: SeenRequest = {
      method: String(config.method).toUpperCase(),
      url: String(config.url),
      params: { ...(config.params ?? {}) },
      headers: lowerHeaders(config),
      body: bodyOf(config.data),
      config,
    };
    seen.push(req);
    let reply: Reply;
    if (isTokenRequest(req)) {
      tokenCount += 1;
      reply = {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ access_token: `token-${tokenCount + 1}` }),
      };
    } else {
      const next = () => google.handle(req);
      reply = fault ? await fault(req, next) : next();
    }
    if ('fail' in reply) {
      throw reply.fail === 'timeout'
        ? new AxiosError('timeout of 60000ms exceeded', 'ECONNABORTED', config)
        : new AxiosError('socket hang up', 'ECONNRESET', config);
    }
    const response: AxiosResponse = {
      data: reply.body ?? '',
      status: reply.status,
      statusText: '',
      headers: reply.headers ?? {},
      config,
      request: {},
    };
    const validate = config.validateStatus;
    if (!validate || validate(reply.status)) return response;
    throw new AxiosError(
      `Request failed with status code ${reply.status}`,
      reply.status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST',
      config,
      {},
      response
    );
  };

  return {
    client,
    core,
    google,
    seen,
    proxied: () => seen.filter((r) => !isTokenRequest(r)),
    tokenCalls: () => tokenCount,
    setFault: (f) => {
      fault = f;
    },
  };
}

function bytes(n: number, seed = 7): Buffer {
  const b = Buffer.alloc(n);
  for (let i = 0; i < n; i++) b[i] = (i * 31 + seed) & 0xff;
  return b;
}

/** Yields `data` in pieces of the given sizes (cycled), like a stream would. */
async function* pieces(data: Buffer, sizes: number[] = [65536]) {
  let offset = 0;
  let i = 0;
  while (offset < data.length) {
    const size = sizes[i++ % sizes.length];
    yield data.subarray(offset, offset + size);
    offset += size;
  }
}

function params(
  overrides: Partial<ResumableUploadParams> = {}
): ResumableUploadParams {
  return {
    connectionName: 'googledrive',
    identifier: 'user_123',
    path: UPLOAD_PATH,
    data: bytes(10),
    chunkSize: CHUNK,
    ...overrides,
  };
}

const ranges = (h: Harness) =>
  h
    .proxied()
    .filter((r) => r.params.upload_id)
    .map((r) => r.headers['content-range']);

/** Fault that answers the n-th proxied request (0-based) with `reply`. */
function failNth(
  h: Harness,
  n: number,
  reply: Reply | ((next: () => Reply) => Reply),
  ...more: Array<[number, Reply | ((next: () => Reply) => Reply)]>
): void {
  const plan = new Map([[n, reply], ...more]);
  let index = 0;
  h.setFault((_req, next) => {
    const r = plan.get(index++);
    if (r === undefined) return next();
    return typeof r === 'function' ? r(next) : r;
  });
}

beforeEach(() => {
  // Backoff delays become 0 ms.
  jest.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('actions.uploadResumable', () => {
  it('exists on the actions client', () => {
    const { client } = makeHarness();
    expect(typeof client.actions.uploadResumable).toBe('function');
  });

  describe('protocol', () => {
    it('uploads known-size bytes in 256 KiB chunks and returns the resource', async () => {
      const h = makeHarness();
      const data = bytes(600 * KIB);
      const progress: UploadProgress[] = [];

      const file = await h.client.actions.uploadResumable(
        params({
          data,
          contentType: 'video/mp4',
          metadata: { name: 'clip.mp4', parents: ['folder_1'] },
          queryParams: { supportsAllDrives: true, part: 'snippet,status' },
        }),
        { onProgress: (p) => void progress.push(p) }
      );

      expect(file).toEqual({ id: 'file_1', size: String(600 * KIB) });
      expect(h.google.received.equals(data)).toBe(true);

      const [start, ...chunks] = h.proxied();
      expect(start.method).toBe('POST');
      expect(start.url).toBe(`${ENV_URL}/proxy${UPLOAD_PATH}`);
      expect(start.params).toEqual({
        uploadType: 'resumable',
        supportsAllDrives: true,
        part: 'snippet,status',
      });
      expect(start.headers['x-upload-content-type']).toBe('video/mp4');
      expect(start.headers['x-upload-content-length']).toBe(String(600 * KIB));
      expect(start.headers['content-type']).toBe(
        'application/json; charset=UTF-8'
      );
      expect(JSON.parse(start.body.toString())).toEqual({
        name: 'clip.mp4',
        parents: ['folder_1'],
      });

      // Chunk requests repeat only uploadType + upload_id (checked by the
      // fake), never the caller's query parameters.
      expect(chunks.map((c) => c.headers['content-range'])).toEqual([
        'bytes 0-262143/614400',
        'bytes 262144-524287/614400',
        'bytes 524288-614399/614400',
      ]);
      for (const r of h.proxied()) {
        expect(r.headers.connection_name).toBe('googledrive');
        expect(r.headers.identifier).toBe('user_123');
        expect(r.headers.authorization).toBe('Bearer token-1');
        expect(r.headers['x-sdk-version']).toMatch(/^Scalekit-Node\//);
        expect(r.config.maxRedirects).toBe(0);
        expect(r.config.timeout).toBe(60_000);
      }
      for (const c of chunks)
        expect(c.headers['content-type']).toBe('video/mp4');

      expect(progress).toEqual([
        { bytesCommitted: 262144, totalBytes: 614400 },
        { bytesCommitted: 524288, totalBytes: 614400 },
        { bytesCommitted: 614400, totalBytes: 614400 },
      ]);
      expect(h.tokenCalls()).toBe(0);
    });

    it('accepts 308 and rejects other redirects through validateStatus', async () => {
      const h = makeHarness();
      await h.client.actions.uploadResumable(params());
      const validate = h.proxied()[0].config.validateStatus!;
      expect([200, 201, 204, 308].map(validate)).toEqual([
        true,
        true,
        true,
        true,
      ]);
      expect([301, 302, 307, 400, 404, 500].map(validate)).toEqual([
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });

    it('sends only the bytes of a Uint8Array view, not its whole buffer', async () => {
      const h = makeHarness();
      const backing = new Uint8Array(bytes(1000));
      const view = backing.subarray(100, 300);

      await h.client.actions.uploadResumable(params({ data: view }));

      expect(h.google.received.equals(Buffer.from(view))).toBe(true);
      expect(ranges(h)).toEqual(['bytes 0-199/200']);
    });

    it('streams content of unknown size with "*" until the last chunk', async () => {
      const h = makeHarness();
      const data = bytes(600 * KIB);
      const progress: UploadProgress[] = [];

      await h.client.actions.uploadResumable(
        params({ data: pieces(data, [65536, 100000, 7]) }),
        { onProgress: (p) => void progress.push(p) }
      );

      expect(h.google.received.equals(data)).toBe(true);
      expect(h.proxied()[0].headers['x-upload-content-length']).toBeUndefined();
      expect(ranges(h)).toEqual([
        'bytes 0-262143/*',
        'bytes 262144-524287/*',
        'bytes 524288-614399/614400',
      ]);
      expect(progress).toEqual([
        { bytesCommitted: 262144, totalBytes: undefined },
        { bytesCommitted: 524288, totalBytes: undefined },
        { bytesCommitted: 614400, totalBytes: 614400 },
      ]);
    });

    it('sends the total on the last chunk when an unknown total is an exact multiple of the chunk size', async () => {
      const h = makeHarness();
      const data = bytes(2 * CHUNK);

      await h.client.actions.uploadResumable(params({ data: pieces(data) }));

      expect(ranges(h)).toEqual([
        'bytes 0-262143/*',
        'bytes 262144-524287/524288',
      ]);
      expect(h.google.received.equals(data)).toBe(true);
    });

    it('sets X-Upload-Content-Length for a stream that fits in one chunk', async () => {
      const h = makeHarness();
      await h.client.actions.uploadResumable(
        params({ data: pieces(bytes(1000), [300]) })
      );
      expect(h.proxied()[0].headers['x-upload-content-length']).toBe('1000');
      expect(ranges(h)).toEqual(['bytes 0-999/1000']);
    });

    it.each([
      ['empty bytes', () => Buffer.alloc(0)],
      ['empty stream', () => pieces(Buffer.alloc(0))],
    ])(
      'uploads zero bytes (%s) with one "bytes */0" request',
      async (_label, make) => {
        const h = makeHarness();
        const progress: UploadProgress[] = [];

        const file = await h.client.actions.uploadResumable(
          params({ data: make() }),
          { onProgress: (p) => void progress.push(p) }
        );

        expect(file).toEqual({ id: 'file_1', size: '0' });
        expect(h.proxied()[0].headers['x-upload-content-length']).toBe('0');
        expect(ranges(h)).toEqual(['bytes */0']);
        expect(progress).toEqual([{ bytesCommitted: 0, totalBytes: 0 }]);
      }
    );

    it('derives the size of an unread fs.createReadStream, and not of a partial one', async () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sk-upload-'));
      const file = path.join(dir, 'data.bin');
      const data = bytes(300 * KIB);
      fs.writeFileSync(file, data);
      try {
        const h = makeHarness();
        await h.client.actions.uploadResumable(
          params({ data: fs.createReadStream(file) })
        );
        expect(h.proxied()[0].headers['x-upload-content-length']).toBe(
          String(300 * KIB)
        );
        expect(ranges(h)[0]).toBe('bytes 0-262143/307200');
        expect(h.google.received.equals(data)).toBe(true);

        const partial = makeHarness();
        await partial.client.actions.uploadResumable(
          params({ data: fs.createReadStream(file, { start: 10 }) })
        );
        expect(
          partial.proxied()[0].headers['x-upload-content-length']
        ).toBeUndefined();
        expect(partial.google.received.equals(data.subarray(10))).toBe(true);
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    it('sends method in upper case and adds a leading slash to path', async () => {
      const h = makeHarness();
      await h.client.actions.uploadResumable(
        params({
          path: 'upload/drive/v3/files/file_9',
          method: 'patch' as 'PATCH',
        })
      );
      const [start, chunk] = h.proxied();
      expect(start.method).toBe('PATCH');
      expect(start.url).toBe(`${ENV_URL}/proxy/upload/drive/v3/files/file_9`);
      expect(start.headers['content-type']).toBeUndefined();
      expect(start.body.length).toBe(0);
      expect(start.headers['x-upload-content-type']).toBe(
        'application/octet-stream'
      );
      expect(chunk.method).toBe('PUT');
    });

    it('resends from the committed offset after a partial commit', async () => {
      const h = makeHarness();
      const data = bytes(400 * KIB);
      h.google.partialCommit = 100_000;

      await h.client.actions.uploadResumable(params({ data }));

      expect(ranges(h)).toEqual([
        'bytes 0-262143/409600',
        'bytes 100000-262143/409600',
        'bytes 262144-409599/409600',
      ]);
      expect(h.google.received.equals(data)).toBe(true);
    });

    it('backs off and resends from 0 after a 308 with no Range header', async () => {
      const h = makeHarness();
      const data = bytes(300 * KIB);
      h.google.partialCommit = 0;

      await h.client.actions.uploadResumable(params({ data }));

      expect(ranges(h)).toEqual([
        'bytes 0-262143/307200',
        'bytes 0-262143/307200',
        'bytes 262144-307199/307200',
      ]);
    });

    it('returns {} for an empty final body', async () => {
      const h = makeHarness();
      h.google.finalBody = '';
      h.google.finalStatus = 201;
      await expect(h.client.actions.uploadResumable(params())).resolves.toEqual(
        {}
      );
    });
  });

  describe('retries', () => {
    it('queries the status after a 503 and resumes from the committed offset', async () => {
      const h = makeHarness();
      const data = bytes(600 * KIB);
      failNth(h, 2, { status: 503 }); // second chunk

      await h.client.actions.uploadResumable(params({ data }));

      expect(ranges(h)).toEqual([
        'bytes 0-262143/614400',
        'bytes 262144-524287/614400',
        'bytes */614400',
        'bytes 262144-524287/614400',
        'bytes 524288-614399/614400',
      ]);
      expect(h.google.received.equals(data)).toBe(true);
      const query = h.proxied()[3];
      expect(query.method).toBe('PUT');
      expect(query.body.length).toBe(0);
      expect(query.headers['content-type']).toBeUndefined();
    });

    it('does not resend a chunk the server committed before the response was lost', async () => {
      const h = makeHarness();
      const data = bytes(600 * KIB);
      const progress: number[] = [];
      failNth(h, 1, (next) => {
        next(); // the server stores the chunk...
        return { fail: 'timeout' }; // ...but the response never arrives
      });

      await h.client.actions.uploadResumable(params({ data }), {
        onProgress: (p) => void progress.push(p.bytesCommitted),
      });

      expect(ranges(h)).toEqual([
        'bytes 0-262143/614400',
        'bytes */614400',
        'bytes 262144-524287/614400',
        'bytes 524288-614399/614400',
      ]);
      expect(progress).toEqual([262144, 524288, 614400]);
    });

    it('completes when the status query after a lost final response returns 200', async () => {
      const h = makeHarness();
      failNth(h, 1, (next) => {
        next();
        return { fail: 'reset' };
      });
      const file = await h.client.actions.uploadResumable(params());
      expect(file).toEqual({ id: 'file_1', size: '10' });
      expect(ranges(h)).toEqual(['bytes 0-9/10', 'bytes */10']);
    });

    it.each([408, 429, 500, 502, 503, 504])(
      'retries HTTP %i',
      async (status) => {
        const h = makeHarness();
        failNth(h, 1, { status });
        await h.client.actions.uploadResumable(params());
        expect(ranges(h)).toEqual([
          'bytes 0-9/10',
          'bytes */10',
          'bytes 0-9/10',
        ]);
      }
    );

    it('raises the last HTTP error after maxRetries, counting status queries', async () => {
      const h = makeHarness();
      const data = bytes(300 * KIB);
      failNth(
        h,
        2,
        { status: 503 },
        [3, { status: 502 }],
        [
          4,
          {
            status: 503,
            headers: { 'content-type': 'application/json' },
            body: '{"error":{"code":503}}',
          },
        ]
      );

      const err = await h.client.actions
        .uploadResumable(params({ data }), { maxRetries: 2 })
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expect(err).not.toBeInstanceOf(ScalekitUploadSessionExpiredException);
      const e = err as ScalekitUploadHttpException;
      expect(e.status).toBe(503);
      expect(e.httpStatus).toBe(503);
      expect(e.retryable).toBe(true);
      expect(e.uploadId).toBe(UPLOAD_ID);
      expect(e.bytesCommitted).toBe(CHUNK);
      expect(e.body).toEqual({ error: { code: 503 } });
      expect(e.headers['content-type']).toBe('application/json');
      expect(e.cause).toBeInstanceOf(AxiosError);
      expect(ranges(h)).toEqual([
        'bytes 0-262143/307200',
        'bytes 262144-307199/307200',
        'bytes */307200',
        'bytes */307200',
      ]);
    });

    it('resets the retry count whenever the committed offset advances', async () => {
      const h = makeHarness();
      const data = bytes(3 * CHUNK);
      // Every chunk is stored, but its response is lost. With maxRetries 1 the
      // upload only survives because each status query reports progress.
      h.setFault((req, next) => {
        const reply = next();
        const range = req.headers['content-range'] ?? '';
        return !req.params.upload_id || range.startsWith('bytes */')
          ? reply
          : { fail: 'timeout' };
      });

      const file = await h.client.actions.uploadResumable(params({ data }), {
        maxRetries: 1,
      });

      expect(file).toEqual({ id: 'file_1', size: String(3 * CHUNK) });
      expect(ranges(h)).toEqual([
        'bytes 0-262143/786432',
        'bytes */786432',
        'bytes 262144-524287/786432',
        'bytes */786432',
        'bytes 524288-786431/786432',
        'bytes */786432',
      ]);
    });

    it('raises ScalekitUploadTimeoutException after timeouts run out', async () => {
      const h = makeHarness();
      failNth(h, 1, { fail: 'timeout' });
      const err = await h.client.actions
        .uploadResumable(params(), { maxRetries: 0, timeoutMs: 5_000 })
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(ScalekitUploadTimeoutException);
      expect(err).toBeInstanceOf(ScalekitGatewayTimeoutException);
      const e = err as ScalekitUploadTimeoutException;
      expect(e.retryable).toBe(true);
      expect(e.uploadId).toBe(UPLOAD_ID);
      expect(e.bytesCommitted).toBe(0);
      expect(e.httpStatus).toBe(504);
      expect(e.cause).toBeInstanceOf(AxiosError);
      expect(h.proxied()[1].config.timeout).toBe(5_000);
    });

    it('raises ScalekitUploadConnectionException after connection errors run out', async () => {
      const h = makeHarness();
      failNth(h, 1, { fail: 'reset' }, [2, { fail: 'reset' }]);
      const err = await h.client.actions
        .uploadResumable(params(), { maxRetries: 1 })
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(ScalekitUploadConnectionException);
      const e = err as ScalekitUploadConnectionException;
      expect(e.message).toContain('ECONNRESET');
      expect(e.retryable).toBe(true);
      expect(e.uploadId).toBe(UPLOAD_ID);
      expect(ranges(h)).toEqual(['bytes 0-9/10', 'bytes */10']);
    });

    it('waits for Retry-After on a 429, capped at 30 s', async () => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
      const h = makeHarness();
      failNth(h, 1, { status: 429, headers: { 'retry-after': '2' } });

      const done = h.client.actions.uploadResumable(params());
      await jest.advanceTimersByTimeAsync(1_999);
      expect(ranges(h)).toEqual(['bytes 0-9/10']);
      await jest.advanceTimersByTimeAsync(1);
      await expect(done).resolves.toEqual({ id: 'file_1', size: '10' });
      expect(ranges(h)).toEqual(['bytes 0-9/10', 'bytes */10', 'bytes 0-9/10']);
    });

    it('caps the first backoff delay at 500 ms', async () => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
      // The jitter's upper bound: the first delay is at most 500 ms.
      jest.mocked(Math.random).mockReturnValue(1);
      const h = makeHarness();
      failNth(h, 1, { status: 500 });

      const done = h.client.actions.uploadResumable(params());
      await jest.advanceTimersByTimeAsync(499);
      expect(ranges(h)).toHaveLength(1);
      await jest.advanceTimersByTimeAsync(1);
      await expect(done).resolves.toBeDefined();
      expect(ranges(h)).toHaveLength(3);
    });

    it('never retries the session-start request', async () => {
      for (const reply of [
        { status: 503 },
        { fail: 'timeout' as const },
        { fail: 'reset' as const },
      ]) {
        const h = makeHarness();
        failNth(h, 0, reply);
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(h.proxied()).toHaveLength(1);
        expect((err as { uploadId?: unknown }).uploadId).toBeUndefined();
        expect((err as { bytesCommitted?: unknown }).bytesCommitted).toBe(0);
        if ('status' in reply) {
          expect(err).toBeInstanceOf(ScalekitUploadHttpException);
          expect((err as ScalekitUploadHttpException).status).toBe(503);
        } else if (reply.fail === 'timeout') {
          expect(err).toBeInstanceOf(ScalekitUploadTimeoutException);
        } else {
          expect(err).toBeInstanceOf(ScalekitUploadConnectionException);
        }
      }
    });
  });

  describe('protocol guards', () => {
    it('treats a 308 that commits no new bytes as a failure and raises a protocol error when retries run out', async () => {
      const h = makeHarness();
      const data = bytes(300 * KIB);
      // Second chunk: the server keeps answering 308 with only the first chunk.
      h.setFault((req, next) =>
        req.headers['content-range'] === 'bytes 262144-307199/307200'
          ? { status: 308, headers: { range: 'bytes=0-262143' } }
          : next()
      );
      const err = await h.client.actions
        .uploadResumable(params({ data }), { maxRetries: 2 })
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
      const e = err as ScalekitUploadProtocolException;
      expect(e.status).toBe(308);
      expect(e.uploadId).toBe(UPLOAD_ID);
      expect(e.bytesCommitted).toBe(CHUNK);
      // 1 try + 2 retries, resent directly: the 308 already gave the offset.
      expect(ranges(h)).toEqual([
        'bytes 0-262143/307200',
        'bytes 262144-307199/307200',
        'bytes 262144-307199/307200',
        'bytes 262144-307199/307200',
      ]);
    });

    it('backs off before resending after a 308 that commits nothing', async () => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
      jest.mocked(Math.random).mockReturnValue(1);
      const h = makeHarness();
      failNth(h, 1, { status: 308 });

      const done = h.client.actions.uploadResumable(params());
      await jest.advanceTimersByTimeAsync(499);
      expect(ranges(h)).toEqual(['bytes 0-9/10']);
      await jest.advanceTimersByTimeAsync(1);
      await expect(done).resolves.toEqual({ id: 'file_1', size: '10' });
      expect(ranges(h)).toEqual(['bytes 0-9/10', 'bytes 0-9/10']);
    });

    it('raises a protocol error for a 200 on a chunk before the last chunk was sent', async () => {
      const h = makeHarness();
      failNth(h, 1, { status: 200, body: '{"id":"truncated"}' });
      const err = await h.client.actions
        .uploadResumable(params({ data: bytes(300 * KIB) }))
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
      expect((err as ScalekitUploadProtocolException).status).toBe(200);
      expect(ranges(h)).toEqual(['bytes 0-262143/307200']);
    });

    it('raises a protocol error for a 201 on a status query before the last chunk was sent', async () => {
      const h = makeHarness();
      failNth(h, 1, { status: 503 }, [2, { status: 201, body: '{}' }]);
      await expect(
        h.client.actions.uploadResumable(params({ data: bytes(300 * KIB) }))
      ).rejects.toBeInstanceOf(ScalekitUploadProtocolException);
      expect(ranges(h)).toEqual(['bytes 0-262143/307200', 'bytes */307200']);
    });

    it.each([
      [
        'chunk',
        [[1, { status: 302, headers: { location: 'https://example.com/' } }]],
        ['bytes 0-9/10'],
      ],
      [
        'status query',
        [
          [1, { status: 503 }],
          [2, { status: 302, headers: { location: 'https://example.com/' } }],
        ],
        ['bytes 0-9/10', 'bytes */10'],
      ],
    ] as Array<[string, Array<[number, Reply]>, string[]]>)(
      'raises a protocol error, without retrying, for a 302 on a %s',
      async (_label, faults, expectedRanges) => {
        const h = makeHarness();
        const [first, ...rest] = faults;
        failNth(h, first[0], first[1], ...rest);
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
        const e = err as ScalekitUploadProtocolException;
        expect(e.uploadId).toBe(UPLOAD_ID);
        expect(e.status).toBe(302);
        expect(e.headers?.location).toBe('https://example.com/');
        expect(ranges(h)).toEqual(expectedRanges);
      }
    );

    it('runs out of retries when the server bounces between two offsets inside a chunk', async () => {
      const h = makeHarness();
      const data = bytes(300 * KIB);
      // Chunk 2 spans 262144-307199. The server alternates between two
      // committed offsets in it; only the first visit to each is progress.
      const offsets = [270_000, 280_000];
      let n = 0;
      h.setFault((req, next) => {
        const range = req.headers['content-range'] ?? '';
        if (!req.params.upload_id || range.startsWith('bytes 0-')) {
          return next();
        }
        const last = offsets[n++ % 2] - 1;
        return { status: 308, headers: { range: `bytes=0-${last}` } };
      });
      const progress: number[] = [];

      const err = await h.client.actions
        .uploadResumable(params({ data }), {
          maxRetries: 2,
          onProgress: (p) => {
            progress.push(p.bytesCommitted);
            // Without a high-water mark this would loop forever.
            if (progress.length > 10) throw new Error('retries never ran out');
          },
        })
        .catch((e: unknown) => e);

      expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
      expect((err as ScalekitUploadProtocolException).status).toBe(308);
      expect(progress).toEqual([262144, 270000, 280000]);
      // chunk 1, then chunk 2 sent 5 times: two new highs, then 3 failures.
      expect(ranges(h)).toEqual([
        'bytes 0-262143/307200',
        'bytes 262144-307199/307200',
        'bytes 270000-307199/307200',
        'bytes 280000-307199/307200',
        'bytes 270000-307199/307200',
        'bytes 280000-307199/307200',
      ]);
    });

    it.each([202, 204])(
      'raises ScalekitUploadHttpException for a %i on a chunk, without retrying',
      async (status) => {
        const h = makeHarness();
        failNth(h, 1, { status });
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadHttpException);
        expect((err as ScalekitUploadHttpException).status).toBe(status);
        expect((err as ScalekitUploadHttpException).uploadId).toBe(UPLOAD_ID);
        expect(ranges(h)).toEqual(['bytes 0-9/10']);
      }
    );
  });

  describe('proxy containment', () => {
    it('accepts paths that stay under /proxy/', () => {
      expect(resolvesInsideProxy(ENV_URL, '/upload/drive/v3/files')).toBe(true);
      expect(resolvesInsideProxy(`${ENV_URL}/`, '/upload/x')).toBe(true);
      expect(resolvesInsideProxy(`${ENV_URL}/base`, '/upload/x')).toBe(true);
    });

    it.each([
      '/upload/.\t./.\t./api/v1/organizations',
      '/upload/../../api/v1/organizations',
      '/upload/%2e%2e/%2e%2e/x',
      '/..',
      '\\..\\..\\x',
    ])('rejects %j, which the URL parser resolves outside /proxy/', (p) => {
      expect(resolvesInsideProxy(ENV_URL, p)).toBe(false);
      expect(resolvesInsideProxy(`${ENV_URL}/base`, p)).toBe(false);
    });
  });

  describe('errors', () => {
    it.each([
      [404, 1],
      [410, 1],
    ])(
      'raises ScalekitUploadSessionExpiredException on %i for a chunk',
      async (status) => {
        const h = makeHarness();
        failNth(h, 1, { status });
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadSessionExpiredException);
        expect(err).toBeInstanceOf(ScalekitUploadHttpException);
        expect((err as ScalekitUploadHttpException).status).toBe(status);
        expect((err as ScalekitUploadHttpException).retryable).toBe(false);
        expect((err as ScalekitUploadHttpException).uploadId).toBe(UPLOAD_ID);
        expect(h.proxied()).toHaveLength(2);
      }
    );

    it('raises ScalekitUploadSessionExpiredException on 410 for a status query', async () => {
      const h = makeHarness();
      failNth(h, 1, { status: 503 }, [2, { status: 410 }]);
      await expect(
        h.client.actions.uploadResumable(params())
      ).rejects.toBeInstanceOf(ScalekitUploadSessionExpiredException);
    });

    it('raises a 404 on the session-start request as ScalekitUploadHttpException, not expiry', async () => {
      const h = makeHarness();
      failNth(h, 0, { status: 404, body: 'Not Found' });
      const err = await h.client.actions
        .uploadResumable(params())
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expect(err).not.toBeInstanceOf(ScalekitUploadSessionExpiredException);
      expect((err as ScalekitUploadHttpException).status).toBe(404);
      expect((err as ScalekitUploadHttpException).body).toBe('Not Found');
    });

    it('raises other 4xx on a chunk immediately', async () => {
      const h = makeHarness();
      failNth(h, 1, {
        status: 403,
        headers: { 'content-type': 'application/json' },
        body: '{"error":{"message":"insufficient permissions"}}',
      });
      const err = await h.client.actions
        .uploadResumable(params())
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      const e = err as ScalekitUploadHttpException;
      expect(e).toBeInstanceOf(ScalekitServerException);
      expect(e.status).toBe(403);
      expect(e.httpStatus).toBe(403);
      expect(e.retryable).toBe(false);
      expect(e.body).toEqual({
        error: { message: 'insufficient permissions' },
      });
      expect(h.proxied()).toHaveLength(2);
    });

    it.each<[string, Reply]>([
      ['no Location', { status: 200 }],
      [
        'Location without upload_id',
        {
          status: 200,
          headers: {
            location: 'https://www.googleapis.com/upload/drive/v3/files',
          },
        },
      ],
      ['a 308', { status: 308 }],
      ['a 302', { status: 302, headers: { location: 'https://example.com/' } }],
    ])(
      'raises ScalekitUploadProtocolException for a session start with %s',
      async (_label, reply) => {
        const h = makeHarness();
        failNth(h, 0, reply);
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
        expect(err).not.toBeInstanceOf(ScalekitUploadHttpException);
        const e = err as ScalekitUploadProtocolException;
        expect(e.status).toBe((reply as { status: number }).status);
        expect(e.uploadId).toBeUndefined();
        expect(h.proxied()).toHaveLength(1);
      }
    );

    it.each([
      ['moves backwards before the chunk start', 'bytes=0-9'],
      ['goes past the bytes sent', 'bytes=0-600000'],
      ['is malformed', 'bytes 0-5'],
    ])(
      'raises ScalekitUploadProtocolException when Range %s',
      async (_l, range) => {
        const h = makeHarness();
        const data = bytes(600 * KIB);
        failNth(h, 2, { status: 308, headers: { range } });
        const err = await h.client.actions
          .uploadResumable(params({ data }))
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
        const e = err as ScalekitUploadProtocolException;
        expect(e.uploadId).toBe(UPLOAD_ID);
        expect(e.bytesCommitted).toBe(CHUNK);
        expect(e.status).toBe(308);
        expect(e.headers?.range).toBe(range);
      }
    );

    it('raises ScalekitUploadProtocolException when every byte is confirmed but the upload is not completed', async () => {
      const h = makeHarness();
      failNth(h, 1, { status: 308, headers: { range: 'bytes=0-9' } });
      await expect(
        h.client.actions.uploadResumable(params())
      ).rejects.toBeInstanceOf(ScalekitUploadProtocolException);
    });

    it.each([
      ['not JSON', '<html>ok</html>'],
      ['a JSON array', '[1,2]'],
      ['JSON null', 'null'],
    ])(
      'raises ScalekitUploadProtocolException when the final body is %s',
      async (_l, body) => {
        const h = makeHarness();
        h.google.finalBody = body;
        const err = await h.client.actions
          .uploadResumable(params())
          .catch((e: unknown) => e);
        expect(err).toBeInstanceOf(ScalekitUploadProtocolException);
        expect((err as ScalekitUploadProtocolException).status).toBe(200);
        expect((err as ScalekitUploadProtocolException).body).toEqual(
          body === '<html>ok</html>' ? body : JSON.parse(body)
        );
      }
    );

    it('propagates an onProgress error unchanged and stops', async () => {
      const h = makeHarness();
      const boom = new Error('stop here');
      const err = await h.client.actions
        .uploadResumable(params({ data: bytes(600 * KIB) }), {
          onProgress: () => {
            throw boom;
          },
        })
        .catch((e: unknown) => e);
      expect(err).toBe(boom);
      expect(ranges(h)).toHaveLength(1);
    });

    it('waits for an async onProgress before sending the next chunk', async () => {
      const h = makeHarness();
      const events: string[] = [];
      h.setFault((req, next) => {
        events.push(`send ${req.headers['content-range'] ?? 'start'}`);
        return next();
      });
      await h.client.actions.uploadResumable(
        params({ data: bytes(300 * KIB) }),
        {
          onProgress: async (p) => {
            await new Promise((r) => setTimeout(r, 5));
            events.push(`progress ${p.bytesCommitted}`);
          },
        }
      );
      expect(events).toEqual([
        'send start',
        'send bytes 0-262143/307200',
        'progress 262144',
        'send bytes 262144-307199/307200',
        'progress 307200',
      ]);
    });

    it('propagates a read error from the caller’s stream unchanged', async () => {
      const h = makeHarness();
      const readError = new Error('disk gone');
      let closed = false;
      async function* broken() {
        try {
          yield bytes(CHUNK);
          yield bytes(10);
          throw readError;
        } finally {
          closed = true;
        }
      }
      const err = await h.client.actions
        .uploadResumable(params({ data: broken() }))
        .catch((e: unknown) => e);
      expect(err).toBe(readError);
      expect(closed).toBe(true);
    });

    it('releases the caller’s stream when the upload fails', async () => {
      const h = makeHarness();
      let closed = false;
      async function* endless() {
        try {
          for (;;) yield bytes(CHUNK);
        } finally {
          closed = true;
        }
      }
      failNth(h, 1, { status: 403 });
      await expect(
        h.client.actions.uploadResumable(params({ data: endless() }))
      ).rejects.toBeInstanceOf(ScalekitUploadHttpException);
      expect(closed).toBe(true);
    });

    it('keeps the access token and client secret out of errors', async () => {
      const h = makeHarness({ token: 'secret-access-token' });
      failNth(h, 1, { status: 403, body: 'denied' });
      const err = await h.client.actions
        .uploadResumable(params())
        .catch((e: unknown) => e);
      // Stack source-mapping sorts with Math.random; give it the real one.
      jest.mocked(Math.random).mockRestore();
      const text = inspect(err, { depth: Infinity, showHidden: true });
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expect(text).not.toContain('secret-access-token');
      expect(text).not.toContain('client_secret');
      expect(String(err)).toBe(
        'ScalekitUploadHttpException: The upload failed with HTTP 403 on the chunk request'
      );
    });
  });

  describe('redaction', () => {
    const MARKER = Buffer.from('SK-SECRET-CONTENT-MARKER-91f3');
    const secretData = () =>
      Buffer.concat([bytes(1000), MARKER, bytes(1000), MARKER]);

    function expectClean(err: unknown): void {
      // Stack source-mapping sorts with Math.random; give it the real one.
      jest.mocked(Math.random).mockRestore();
      const views = [
        inspect(err, { depth: Infinity, showHidden: true }),
        JSON.stringify(err),
        String((err as Error).stack),
      ];
      for (const text of views) {
        expect(text).not.toContain(MARKER.toString());
        expect(text).not.toContain(MARKER.toString('base64'));
        expect(text).not.toContain('secret-access-token');
        expect(text).not.toContain('client_secret');
      }
    }

    it('keeps the content, the token and the client secret out of a chunk 500 error', async () => {
      const h = makeHarness({ token: 'secret-access-token' });
      failNth(h, 1, { status: 500, body: 'oops' });
      const err = await h.client.actions
        .uploadResumable(params({ data: secretData() }), { maxRetries: 0 })
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expectClean(err);
    });

    it('keeps them out of a chunk timeout error', async () => {
      const h = makeHarness({ token: 'secret-access-token' });
      failNth(h, 1, { fail: 'timeout' });
      const err = await h.client.actions
        .uploadResumable(params({ data: secretData() }), { maxRetries: 0 })
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadTimeoutException);
      expectClean(err);
    });

    it('keeps them out of a token-endpoint failure', async () => {
      const h = makeHarness({ token: null });
      h.core.axios.defaults.adapter = async (config) => {
        throw new AxiosError(
          'Request failed with status code 500',
          'ERR_BAD_RESPONSE',
          config,
          {},
          {
            data: 'token endpoint down',
            status: 500,
            statusText: '',
            headers: {},
            config,
            request: {},
          }
        );
      };
      const err = await h.client.actions
        .uploadResumable(params({ data: secretData() }))
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitServerException);
      expectClean(err);
    });
  });

  describe('authentication', () => {
    const scalekit401: Reply = {
      status: 401,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ detail: 'token expired', code: 'UNAUTHORIZED' }),
    };

    it('fetches a token first on a cold client, once for parallel uploads', async () => {
      const h = makeHarness({ token: null });
      // Two sessions at once: answer every chunk with "complete".
      h.setFault((req, next) =>
        req.params.upload_id ? { status: 200, body: '{"id":"file_1"}' } : next()
      );
      await Promise.all([
        h.client.actions.uploadResumable(params()),
        h.client.actions.uploadResumable(params()),
      ]);
      expect(h.proxied()).toHaveLength(4);
      expect(h.tokenCalls()).toBe(1);
      expect(isTokenRequest(h.seen[0])).toBe(true);
      for (const r of h.proxied()) {
        expect(r.headers.authorization).toBe('Bearer token-2');
      }
    });

    it('refreshes the token once and resends after a Scalekit 401 on a chunk', async () => {
      const h = makeHarness();
      failNth(h, 1, scalekit401);
      const file = await h.client.actions.uploadResumable(params());
      expect(file).toEqual({ id: 'file_1', size: '10' });
      expect(h.tokenCalls()).toBe(1);
      expect(ranges(h)).toEqual(['bytes 0-9/10', 'bytes 0-9/10']);
      expect(h.proxied()[2].headers.authorization).toBe('Bearer token-2');
    });

    it('refreshes and resends a session start rejected with a Scalekit 401', async () => {
      const h = makeHarness();
      failNth(h, 0, scalekit401);
      await h.client.actions.uploadResumable(params());
      expect(h.google.starts).toBe(1);
      expect(h.proxied()).toHaveLength(3);
      expect(h.proxied()[1].headers.authorization).toBe('Bearer token-2');
    });

    it.each<[string, Reply]>([
      [
        'a provider 401',
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            error: { code: 401, message: 'Invalid Credentials' },
          }),
        },
      ],
      [
        'a 401 with a non-JSON content type',
        {
          status: 401,
          headers: { 'content-type': 'text/plain' },
          body: JSON.stringify({ detail: 'x', code: 'UNAUTHORIZED' }),
        },
      ],
      [
        'a 401 with extra body keys',
        {
          status: 401,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ detail: 'x', code: 'UNAUTHORIZED', more: 1 }),
        },
      ],
    ])('does not refresh or resend for %s', async (_label, reply) => {
      const h = makeHarness();
      failNth(h, 1, reply);
      const err = await h.client.actions
        .uploadResumable(params())
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expect((err as ScalekitUploadHttpException).status).toBe(401);
      expect(h.tokenCalls()).toBe(0);
      expect(h.proxied()).toHaveLength(2);
    });

    it('does not resend when the refreshed token is unchanged', async () => {
      const h = makeHarness({ token: 'token-2' }); // the next token issued
      failNth(h, 1, scalekit401);
      await expect(
        h.client.actions.uploadResumable(params())
      ).rejects.toBeInstanceOf(ScalekitUploadHttpException);
      expect(h.tokenCalls()).toBe(1);
      expect(h.proxied()).toHaveLength(2);
    });

    it('raises a token-endpoint failure as a Scalekit error, not an AxiosError', async () => {
      const h = makeHarness({ token: null });
      h.core.axios.defaults.adapter = async (config) => {
        throw new AxiosError('connect ECONNREFUSED', 'ECONNREFUSED', config);
      };
      const err = await h.client.actions
        .uploadResumable(params())
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitException);
      expect(err).not.toBeInstanceOf(AxiosError);
      expect((err as { cause?: unknown }).cause).toBeInstanceOf(AxiosError);
    });
  });

  describe('cancellation', () => {
    it('sends nothing when the signal is already aborted', async () => {
      const h = makeHarness({ token: null });
      const controller = new AbortController();
      controller.abort(new Error('user cancelled'));
      const err = await h.client.actions
        .uploadResumable(params(), { signal: controller.signal })
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitAbortError);
      expect((err as ScalekitAbortError).retryable).toBe(false);
      expect(((err as ScalekitAbortError).cause as Error).message).toBe(
        'user cancelled'
      );
      expect(h.seen).toHaveLength(0);
    });

    it('aborts a request in flight', async () => {
      const h = makeHarness();
      const controller = new AbortController();
      h.setFault(
        (req, next) =>
          new Promise<Reply>((resolve, reject) => {
            if (!req.params.upload_id) return resolve(next());
            req.config.signal?.addEventListener?.('abort', () =>
              reject(new CanceledError(undefined, undefined, req.config))
            );
            setTimeout(() => controller.abort(), 5);
          })
      );
      await expect(
        h.client.actions.uploadResumable(params(), {
          signal: controller.signal,
        })
      ).rejects.toBeInstanceOf(ScalekitAbortError);
      expect(h.proxied()[1].config.signal).toBe(controller.signal);
    });

    it('aborts during the wait between retries', async () => {
      const h = makeHarness();
      const controller = new AbortController();
      failNth(h, 1, { status: 503, headers: { 'retry-after': '30' } });
      const started = Date.now();
      setTimeout(() => controller.abort(), 20);
      await expect(
        h.client.actions.uploadResumable(params(), {
          signal: controller.signal,
        })
      ).rejects.toBeInstanceOf(ScalekitAbortError);
      expect(Date.now() - started).toBeLessThan(5_000);
      expect(ranges(h)).toEqual(['bytes 0-9/10']);
    });
  });

  describe('validation (before any request)', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    class Meta {
      name = 'x';
    }

    it.each<[string, Partial<ResumableUploadParams> | null]>([
      ['params null', null],
      ['empty connectionName', { connectionName: ' ' }],
      ['empty identifier', { identifier: '' }],
      ['empty path', { path: '' }],
      ['path with ?', { path: '/upload/drive/v3/files?uploadType=media' }],
      ['path with #', { path: '/upload/drive/v3/files#x' }],
      ['path with ..', { path: '/upload/../admin' }],
      ['path with .', { path: '/upload/./drive' }],
      ['path with encoded ..', { path: '/upload/%2E%2e/admin' }],
      ['path with encoded .', { path: '/upload/%2e/drive' }],
      ['path with half-encoded ..', { path: '/upload/.%2E/admin' }],
      ['path with other half-encoded ..', { path: '/upload/%2e./admin' }],
      ['path with tab-split .. segments', { path: '/upload/.\t./.\t./x' }],
      ['path with LF-split ..', { path: '/upload/.\n./x' }],
      ['path with CR after ..', { path: '/upload/..\r/x' }],
      ['path with a space', { path: '/upload/drive v3/files' }],
      ['path with NUL', { path: '/upload/\x00/files' }],
      ['path with DEL', { path: '/upload/\x7f/files' }],
      ['connectionName with CR', { connectionName: 'googledrive\rX-Evil: 1' }],
      ['connectionName with LF', { connectionName: 'googledrive\nX-Evil: 1' }],
      ['identifier with LF', { identifier: 'user_123\nX-Evil: 1' }],
      ['identifier with CR', { identifier: 'user_123\r' }],
      ['contentType with CR', { contentType: 'text/plain\rX-Evil: 1' }],
      ['contentType with LF', { contentType: 'text/plain\nX-Evil: 1' }],
      ['path with backslash ..', { path: '/upload\\..\\admin' }],
      ['method GET', { method: 'GET' as 'POST' }],
      ['chunkSize 0', { chunkSize: 0 }],
      ['chunkSize not a 256 KiB multiple', { chunkSize: CHUNK + 1 }],
      ['chunkSize fractional', { chunkSize: CHUNK * 1.5 }],
      ['negative totalBytes', { totalBytes: -1 }],
      ['fractional totalBytes', { totalBytes: 1.5 }],
      ['totalBytes != byteLength', { data: bytes(10), totalBytes: 11 }],
      ['string data', { data: 'hello' as unknown as Uint8Array }],
      ['null data', { data: null as unknown as Uint8Array }],
      ['empty contentType', { contentType: '' }],
      ['blank contentType', { contentType: '  ' }],
      [
        'array metadata',
        { metadata: [] as unknown as Record<string, unknown> },
      ],
      [
        'class-instance metadata',
        { metadata: new Meta() as unknown as Record<string, unknown> },
      ],
      ['circular metadata', { metadata: circular }],
      ['uploadType in queryParams', { queryParams: { uploadType: 'media' } }],
      [
        'object queryParams value',
        { queryParams: { a: {} as unknown as string } },
      ],
      ['NaN queryParams value', { queryParams: { a: NaN } }],
    ])('rejects %s', async (_label, overrides) => {
      const h = makeHarness({ token: null });
      const input =
        overrides === null
          ? (null as unknown as ResumableUploadParams)
          : params(overrides);
      await expect(
        h.client.actions.uploadResumable(input)
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(h.seen).toHaveLength(0);
    });

    it.each<[string, Record<string, unknown>]>([
      ['timeoutMs 0', { timeoutMs: 0 }],
      ['timeoutMs negative', { timeoutMs: -5 }],
      ['timeoutMs NaN', { timeoutMs: NaN }],
      ['timeoutMs Infinity', { timeoutMs: Infinity }],
      ['maxRetries negative', { maxRetries: -1 }],
      ['maxRetries fractional', { maxRetries: 1.5 }],
      ['onProgress not a function', { onProgress: 'log' }],
    ])('rejects option %s', async (_label, options) => {
      const h = makeHarness({ token: null });
      await expect(
        h.client.actions.uploadResumable(params(), options)
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(h.seen).toHaveLength(0);
    });

    it('is a ScalekitException and an Error, so existing catch blocks still work', () => {
      const err = new ScalekitValidationError('x');
      expect(err).toBeInstanceOf(ScalekitException);
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe('ScalekitValidationError');
    });

    it('rejects a stream longer than totalBytes before its last chunk is sent', async () => {
      const h = makeHarness();
      const err = await h.client.actions
        .uploadResumable(
          params({ data: pieces(bytes(CHUNK + 11)), totalBytes: CHUNK + 10 })
        )
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitValidationError);
      expect(ranges(h)).toEqual(['bytes 0-262143/262154']);
    });

    it('rejects a stream one byte longer than totalBytes at a chunk boundary before sending anything', async () => {
      const h = makeHarness();
      await expect(
        h.client.actions.uploadResumable(
          params({ data: pieces(bytes(CHUNK + 1)), totalBytes: CHUNK })
        )
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(h.proxied()).toHaveLength(0);
    });

    it('rejects a stream shorter than totalBytes before its last chunk is sent', async () => {
      const h = makeHarness();
      const err = await h.client.actions
        .uploadResumable(
          params({ data: pieces(bytes(CHUNK + 5)), totalBytes: CHUNK + 50 })
        )
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitValidationError);
      expect((err as Error).message).toContain('shorter');
      expect(ranges(h)).toEqual(['bytes 0-262143/262194']);
    });

    it('rejects a stream that yields strings', async () => {
      const h = makeHarness();
      async function* text() {
        yield 'not bytes';
      }
      await expect(
        h.client.actions.uploadResumable(
          params({ data: text() as unknown as AsyncIterable<Uint8Array> })
        )
      ).rejects.toBeInstanceOf(ScalekitValidationError);
      expect(h.proxied()).toHaveLength(0);
    });
  });

  describe('delay helpers', () => {
    it('full-jitter backoff starts at 500 ms and is capped at 8 s', () => {
      expect(backoffDelayMs(0, () => 0.999999)).toBeLessThan(500);
      expect(backoffDelayMs(0, () => 0.999999)).toBeGreaterThan(499);
      expect(backoffDelayMs(1, () => 1)).toBe(1000);
      expect(backoffDelayMs(10, () => 1)).toBe(8000);
      expect(backoffDelayMs(3, () => 0)).toBe(0);
    });

    it('parses Retry-After as seconds or an HTTP date, capped at 30 s', () => {
      const now = Date.parse('2026-10-08T12:00:00Z');
      expect(retryAfterDelayMs('2', now)).toBe(2000);
      expect(retryAfterDelayMs(' 0 ', now)).toBe(0);
      expect(retryAfterDelayMs('120', now)).toBe(30_000);
      expect(retryAfterDelayMs('-3', now)).toBe(0);
      expect(retryAfterDelayMs('Thu, 08 Oct 2026 12:00:05 GMT', now)).toBe(
        5000
      );
      expect(retryAfterDelayMs('Thu, 08 Oct 2026 11:00:00 GMT', now)).toBe(0);
      expect(retryAfterDelayMs('Fri, 09 Oct 2026 12:00:00 GMT', now)).toBe(
        30_000
      );
      expect(retryAfterDelayMs('soon', now)).toBeUndefined();
      expect(retryAfterDelayMs('1.5', now)).toBeUndefined();
      expect(retryAfterDelayMs(undefined, now)).toBeUndefined();
    });

    it('ignores Retry-After on statuses other than 429 and 503', async () => {
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
      const h = makeHarness();
      failNth(h, 1, { status: 500, headers: { 'retry-after': '20' } });
      const done = h.client.actions.uploadResumable(params());
      await jest.advanceTimersByTimeAsync(0);
      await expect(done).resolves.toBeDefined();
      expect(ranges(h)).toHaveLength(3);
    });
  });
});

describe('actions.uploadResumable over a real HTTP connection', () => {
  it('reads a 308 and its Range header instead of following it', async () => {
    const data = bytes(300 * KIB);
    let stored = Buffer.alloc(0);
    const requests: string[] = [];
    const server = http.createServer((req, res) => {
      const parts: Buffer[] = [];
      req.on('data', (p: Buffer) => parts.push(p));
      req.on('end', () => {
        const body = Buffer.concat(parts);
        const url = new URL(req.url ?? '/', 'http://localhost');
        requests.push(`${req.method} ${url.pathname}`);
        if (url.pathname === '/oauth/token') {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ access_token: 'live-token' }));
          return;
        }
        expect(req.headers.authorization).toBe('Bearer live-token');
        if (!url.searchParams.get('upload_id')) {
          res.writeHead(200, {
            location: `http://localhost${url.pathname}?uploadType=resumable&upload_id=abc`,
          });
          res.end();
          return;
        }
        stored = Buffer.concat([stored, body]);
        if (stored.length < data.length) {
          // A 308 with a Location would be followed by a redirecting client.
          res.writeHead(308, {
            range: `bytes=0-${stored.length - 1}`,
            location: 'http://localhost/elsewhere',
          });
          res.end();
          return;
        }
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ id: 'file_real' }));
      });
    });
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', resolve)
    );
    const { port } = server.address() as { port: number };
    try {
      const client = new ScalekitClient(
        `http://127.0.0.1:${port}`,
        'client_id',
        'client_secret'
      );
      const core = (client as unknown as { coreClient: CoreClient }).coreClient;
      // Talk to the local server directly even if an HTTP proxy is configured.
      core.axios.defaults.proxy = false;

      const file = await client.actions.uploadResumable({
        connectionName: 'googledrive',
        identifier: 'user_123',
        path: UPLOAD_PATH,
        data,
        chunkSize: CHUNK,
      });

      expect(file).toEqual({ id: 'file_real' });
      expect(stored.equals(data)).toBe(true);
      expect(requests).toEqual([
        'POST /oauth/token',
        `POST /proxy${UPLOAD_PATH}`,
        `PUT /proxy${UPLOAD_PATH}`,
        `PUT /proxy${UPLOAD_PATH}`,
      ]);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
