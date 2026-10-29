/**
 * connectExec's per-call options: `retryOnUnavailable: false` for calls that
 * must not be sent twice, and `signal`, which turns a cancelled call into
 * ScalekitAbortError before the call, during it and during the wait between
 * retries. Callers that pass no options (or only `timeoutMs`) keep the
 * behaviour they had.
 */
import { describe, it, expect, jest } from '@jest/globals';
import { Code, ConnectError, type CallOptions } from '@connectrpc/connect';
import CoreClient from '../src/core';
import {
  ScalekitAbortError,
  ScalekitServiceUnavailableException,
} from '../src/errors';

function makeClient(): CoreClient {
  return new CoreClient(
    'https://test.scalekit.dev',
    'client_id',
    'client_secret'
  );
}

const unavailable = () => new ConnectError('unavailable', Code.Unavailable);

describe('connectExec retryOnUnavailable', () => {
  it('retries Unavailable by default (unchanged behaviour)', async () => {
    const client = makeClient();
    const sleep = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined as never);
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockRejectedValueOnce(unavailable())
      .mockResolvedValueOnce('ok');

    await expect(client.connectExec(fn, {})).resolves.toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('does not retry Unavailable when retryOnUnavailable is false', async () => {
    const client = makeClient();
    const sleep = jest
      .spyOn(client as any, 'sleep')
      .mockResolvedValue(undefined as never);
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockRejectedValue(unavailable());

    await expect(
      client.connectExec(fn, {}, { retryOnUnavailable: false })
    ).rejects.toBeInstanceOf(ScalekitServiceUnavailableException);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('still refreshes the token once on Unauthenticated when retryOnUnavailable is false', async () => {
    const client = makeClient();
    const auth = jest
      .spyOn(client as any, 'authenticateClient')
      .mockResolvedValue(undefined as never);
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockRejectedValueOnce(new ConnectError('expired', Code.Unauthenticated))
      .mockResolvedValueOnce('ok');

    await expect(
      client.connectExec(fn, {}, { retryOnUnavailable: false })
    ).resolves.toBe('ok');
    expect(auth).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not forward retryOnUnavailable to the call, and keeps the call options', async () => {
    const client = makeClient();
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockResolvedValue('ok');

    await client.connectExec(
      fn,
      { a: 1 },
      { retryOnUnavailable: false, timeoutMs: 1234 }
    );
    expect(fn).toHaveBeenCalledWith({ a: 1 }, { timeoutMs: 1234 });
  });

  it('passes undefined call options when none are given (unchanged behaviour)', async () => {
    const client = makeClient();
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockResolvedValue('ok');

    await client.connectExec(fn, { a: 1 });
    expect(fn).toHaveBeenCalledWith({ a: 1 }, undefined);
  });
});

describe('connectExec signal', () => {
  it('rejects with ScalekitAbortError without calling when the signal has already aborted', async () => {
    const client = makeClient();
    const controller = new AbortController();
    const reason = new Error('caller gave up');
    controller.abort(reason);
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockResolvedValue('ok');

    const error = await client
      .connectExec(fn, {}, { signal: controller.signal })
      .catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ScalekitAbortError);
    expect((error as ScalekitAbortError).cause).toBe(reason);
    expect((error as ScalekitAbortError).retryable).toBe(false);
    expect(fn).not.toHaveBeenCalled();
  });

  it('forwards the signal to the call and maps a cancel during the call to ScalekitAbortError', async () => {
    const client = makeClient();
    const controller = new AbortController();
    const fn = jest.fn(
      (_req: unknown, opts?: CallOptions) =>
        new Promise<string>((_resolve, reject) => {
          opts?.signal?.addEventListener('abort', () =>
            reject(new ConnectError('canceled', Code.Canceled))
          );
        })
    );

    const pending = client.connectExec(fn, {}, { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toBeInstanceOf(ScalekitAbortError);
    expect(fn.mock.calls[0][1]?.signal).toBe(controller.signal);
  });

  it('stops waiting between retries when the signal aborts', async () => {
    const client = makeClient();
    const controller = new AbortController();
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockRejectedValue(unavailable());

    const started = Date.now();
    const pending = client.connectExec(fn, {}, { signal: controller.signal });
    setTimeout(() => controller.abort(), 20);
    await expect(pending).rejects.toBeInstanceOf(ScalekitAbortError);
    // The first backoff is at least 500 ms; aborting must not wait it out.
    expect(Date.now() - started).toBeLessThan(450);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('ignores a signal that never aborts', async () => {
    const client = makeClient();
    const controller = new AbortController();
    const fn = jest
      .fn<(req: unknown, opts?: CallOptions) => Promise<string>>()
      .mockResolvedValue('ok');

    await expect(
      client.connectExec(fn, {}, { signal: controller.signal })
    ).resolves.toBe('ok');
  });
});
