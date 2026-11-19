/**
 * The no-replay wrapper of the provider calls lets an HTTP 429 from the edge through to the retry of
 * `CoreClient.connectExec`, because that request never reached Scalekit, and stops every other `Unavailable`.
 * It tells them apart by the text the gRPC transport gives the error (`HTTP 429`). This test drives the real
 * transport against a local HTTP/2 server, so a change in that text would fail here and not only in production.
 *
 * Offline tests: a local server on 127.0.0.1, no environment is needed.
 */
import {
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
  jest,
} from '@jest/globals';
import * as http2 from 'http2';
import { AddressInfo } from 'net';
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { create, toBinary } from '@bufbuild/protobuf';
import ProvidersClient from '../src/providers';
import CoreClient from '../src/core';
import { ScalekitServiceUnavailableException } from '../src/errors';
import {
  ProviderService,
  ToolCollectionRunSchema,
} from '../src/pkg/grpc/scalekit/v1/providers/providers_pb';

type Answer = 'ok' | '429' | '503';

let server: http2.Http2Server;
let sessions: Set<http2.ServerHttp2Session>;
let requests: number;
let answers: Answer[];
let sleep: jest.SpiedFunction<any>;

/** Answers each request with the next entry of `answers` (the last one repeats). */
function answer(stream: http2.ServerHttp2Stream) {
  requests += 1;
  const next = answers.length > 1 ? answers.shift()! : answers[0];
  if (next !== 'ok') {
    stream.respond({ ':status': next === '429' ? 429 : 503 });
    stream.end();
    return;
  }
  const body = toBinary(
    ToolCollectionRunSchema,
    create(ToolCollectionRunSchema, {
      runId: 'tcr_1',
      providerIdentifier: 'ACMEAPI:1234',
      status: 'QUEUED',
    })
  );
  const frame = Buffer.alloc(5 + body.length);
  frame.writeUInt32BE(body.length, 1);
  Buffer.from(body).copy(frame, 5);
  stream.respond(
    { ':status': 200, 'content-type': 'application/grpc' },
    { waitForTrailers: true }
  );
  stream.on('wantTrailers', () => stream.sendTrailers({ 'grpc-status': '0' }));
  stream.write(frame);
  stream.end();
}

async function providers() {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  const transport = createGrpcTransport({
    baseUrl: `http://127.0.0.1:${port}`,
    idleConnectionTimeoutMs: 100,
  });
  const core = new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
  return new ProvidersClient(
    { createClient: () => createClient(ProviderService, transport) } as any,
    core
  );
}

beforeEach(() => {
  requests = 0;
  sessions = new Set();
  server = http2.createServer();
  server.on('session', (session) => sessions.add(session));
  server.on('stream', answer);
  // `connectExec` backs off for about a second before it replays: do not wait for it.
  sleep = jest
    .spyOn(CoreClient.prototype as any, 'sleep')
    .mockResolvedValue(undefined as never);
});

afterEach(async () => {
  jest.restoreAllMocks();
  sessions.forEach((session) => session.destroy());
  await new Promise((resolve) => server.close(resolve));
});

describe('the real gRPC transport and the no-replay wrapper', () => {
  it('replays triggerToolCollection after an HTTP 429 and returns the run', async () => {
    answers = ['429', 'ok'];
    const client = await providers();

    const run = await client.triggerToolCollection('ACMEAPI:1234');

    expect(run.runId).toBe('tcr_1');
    expect(requests).toBe(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('gives up with ScalekitServiceUnavailableException when every attempt is rate limited', async () => {
    answers = ['429'];
    const client = await providers();

    await expect(
      client.triggerToolCollection('ACMEAPI:1234')
    ).rejects.toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(requests).toBe(4); // the first attempt and three replays
  });

  it('does not replay an HTTP 503', async () => {
    answers = ['503'];
    const client = await providers();

    await expect(
      client.triggerToolCollection('ACMEAPI:1234')
    ).rejects.toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(requests).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
  });
});
