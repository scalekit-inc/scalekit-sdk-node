/**
 * Live tests for actions.uploadResumable against Google Drive through the
 * Scalekit proxy. They run only when these are set (otherwise skipped):
 *
 *   SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET
 *   TEST_AGENTKIT_UPLOAD_IDENTIFIER   identifier of a connected Drive account
 *   TEST_AGENTKIT_UPLOAD_CONNECTION   connection name (default "googledrive")
 *
 * Every file is named sdk-parity-node-<run>-* and deleted after its test. An
 * upload that fails after Google created the file can leave an "Untitled"
 * file; afterAll deletes those created during this run.
 */
import { afterAll, describe, expect, it } from '@jest/globals';
import {
  ScalekitUploadHttpException,
  ScalekitUploadSessionExpiredException,
  type UploadProgress,
} from '../src';

const identifier = process.env.TEST_AGENTKIT_UPLOAD_IDENTIFIER;
const connectionName =
  process.env.TEST_AGENTKIT_UPLOAD_CONNECTION || 'googledrive';
const enabled = Boolean(
  process.env.SCALEKIT_ENVIRONMENT_URL &&
  process.env.SCALEKIT_CLIENT_ID &&
  process.env.SCALEKIT_CLIENT_SECRET &&
  identifier
);

const KIB = 1024;
const CHUNK = 256 * KIB;
const runId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const runStartedAt = new Date(Date.now() - 60_000).toISOString();
const createdIds = new Set<string>();
const payloadSizes = new Set<number>();

function bytes(n: number, seed = 1): Buffer {
  const b = Buffer.alloc(n);
  for (let i = 0; i < n; i++) b[i] = (i * 131 + seed) & 0xff;
  return b;
}

async function* pieces(data: Buffer, size: number) {
  for (let offset = 0; offset < data.length; offset += size) {
    yield data.subarray(offset, offset + size);
  }
}

const drive = (
  path: string,
  method = 'GET',
  queryParams?: Record<string, unknown>
) =>
  client.actions.request({
    connectionName,
    identifier: identifier as string,
    path,
    method,
    queryParams,
  });

async function readBack(id: string): Promise<{ name: string; size: string }> {
  const res = await drive(`/drive/v3/files/${id}`, 'GET', {
    fields: 'id,name,size',
  });
  return res.data as { name: string; size: string };
}

async function deleteFile(id: string): Promise<void> {
  await drive(`/drive/v3/files/${id}`, 'DELETE');
  createdIds.delete(id);
}

function track(file: Record<string, unknown>): string {
  const id = file.id;
  expect(typeof id).toBe('string');
  createdIds.add(id as string);
  return id as string;
}

(enabled ? describe : describe.skip)(
  'actions.uploadResumable (live, Google Drive)',
  () => {
    afterAll(async () => {
      for (const id of [...createdIds]) {
        await deleteFile(id).catch(() => undefined);
      }
      // Orphans from a failed upload: "Untitled" files created during this
      // run whose size matches one of this run's payloads.
      const q = `name = 'Untitled' and createdTime > '${runStartedAt}' and trashed = false`;
      const res = await drive('/drive/v3/files', 'GET', {
        q,
        fields: 'files(id,size)',
        pageSize: 100,
      }).catch(() => undefined);
      const files = (res?.data?.files ?? []) as Array<{
        id: string;
        size?: string;
      }>;
      for (const f of files) {
        if (payloadSizes.has(Number(f.size ?? 0))) {
          await deleteFile(f.id).catch(() => undefined);
        }
      }
    }, 120_000);

    it('uploads known-size bytes in 256 KiB chunks with progress', async () => {
      const data = bytes(600 * KIB);
      payloadSizes.add(data.length);
      const progress: UploadProgress[] = [];
      const name = `sdk-parity-node-${runId}-known.bin`;

      const file = await client.actions.uploadResumable(
        {
          connectionName,
          identifier: identifier as string,
          path: '/upload/drive/v3/files',
          data,
          contentType: 'application/octet-stream',
          metadata: { name },
          chunkSize: CHUNK,
        },
        { onProgress: (p) => void progress.push(p) }
      );
      const id = track(file);
      try {
        expect(file.name).toBe(name);
        expect(progress.map((p) => p.bytesCommitted)).toEqual([
          CHUNK,
          2 * CHUNK,
          data.length,
        ]);
        expect(progress.every((p) => p.totalBytes === data.length)).toBe(true);
        const meta = await readBack(id);
        expect(meta.size).toBe(String(data.length));
      } finally {
        await deleteFile(id).catch(() => undefined);
      }
    }, 120_000);

    it('uploads a stream of unknown size', async () => {
      const data = bytes(300 * KIB, 2);
      payloadSizes.add(data.length);
      const progress: UploadProgress[] = [];

      const file = await client.actions.uploadResumable(
        {
          connectionName,
          identifier: identifier as string,
          path: '/upload/drive/v3/files',
          data: pieces(data, 64 * KIB),
          contentType: 'application/octet-stream',
          metadata: { name: `sdk-parity-node-${runId}-stream.bin` },
          chunkSize: CHUNK,
        },
        { onProgress: (p) => void progress.push(p) }
      );
      const id = track(file);
      try {
        expect(progress[0]).toEqual({
          bytesCommitted: CHUNK,
          totalBytes: undefined,
        });
        expect(progress[progress.length - 1]).toEqual({
          bytesCommitted: data.length,
          totalBytes: data.length,
        });
        expect((await readBack(id)).size).toBe(String(data.length));
      } finally {
        await deleteFile(id).catch(() => undefined);
      }
    }, 120_000);

    it('uploads zero bytes', async () => {
      payloadSizes.add(0);
      const progress: UploadProgress[] = [];
      const file = await client.actions.uploadResumable(
        {
          connectionName,
          identifier: identifier as string,
          path: '/upload/drive/v3/files',
          data: Buffer.alloc(0),
          contentType: 'text/plain',
          metadata: { name: `sdk-parity-node-${runId}-empty.txt` },
        },
        { onProgress: (p) => void progress.push(p) }
      );
      const id = track(file);
      try {
        expect(progress).toEqual([{ bytesCommitted: 0, totalBytes: 0 }]);
        expect(Number((await readBack(id)).size ?? 0)).toBe(0);
      } finally {
        await deleteFile(id).catch(() => undefined);
      }
    }, 120_000);

    it('replaces an existing file’s content with PATCH', async () => {
      const original = bytes(10 * KIB, 3);
      const replacement = bytes(300 * KIB, 4);
      payloadSizes.add(original.length).add(replacement.length);

      const created = await client.actions.uploadResumable({
        connectionName,
        identifier: identifier as string,
        path: '/upload/drive/v3/files',
        data: original,
        metadata: { name: `sdk-parity-node-${runId}-patch.bin` },
      });
      const id = track(created);
      try {
        const updated = await client.actions.uploadResumable({
          connectionName,
          identifier: identifier as string,
          path: `/upload/drive/v3/files/${id}`,
          method: 'PATCH',
          data: replacement,
          chunkSize: CHUNK,
        });
        expect(updated.id).toBe(id);
        expect((await readBack(id)).size).toBe(String(replacement.length));
      } finally {
        await deleteFile(id).catch(() => undefined);
      }
    }, 120_000);

    it('raises ScalekitUploadHttpException with status 404 for a missing file', async () => {
      const err = await client.actions
        .uploadResumable({
          connectionName,
          identifier: identifier as string,
          path: '/upload/drive/v3/files/doesnotexist',
          method: 'PATCH',
          data: bytes(10),
        })
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(ScalekitUploadHttpException);
      expect(err).not.toBeInstanceOf(ScalekitUploadSessionExpiredException);
      const e = err as ScalekitUploadHttpException;
      expect(e.status).toBe(404);
      expect(e.uploadId).toBeUndefined();
    }, 60_000);
  }
);
