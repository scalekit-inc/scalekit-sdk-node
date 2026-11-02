import http from 'node:http';
import type { AddressInfo } from 'node:net';

export interface JwksResponse {
  status?: number;
  body: string;
}

export interface JwksServer {
  /** Use as the environment URL; the JWKS is served at `${url}/keys`. */
  url: string;
  /** Number of requests the server has received for `/keys`. */
  requestCount(): number;
  close(): Promise<void>;
}

/**
 * Serves a JWKS from a local HTTP server, so token validation runs through
 * whatever transport `jose` uses on this runtime (node:http(s) or fetch)
 * without reaching the network.
 */
export async function startJwksServer(
  respond: () => JwksResponse
): Promise<JwksServer> {
  let count = 0;
  const server = http.createServer((req, res) => {
    if (req.url !== '/keys') {
      res.statusCode = 404;
      res.end();
      return;
    }
    count += 1;
    const { status = 200, body } = respond();
    res.statusCode = status;
    res.setHeader('content-type', 'application/json');
    res.end(body);
  });
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve())
  );
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    requestCount: () => count,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

/** Returns a URL on 127.0.0.1 where nothing is listening. */
export async function unusedLocalUrl(): Promise<string> {
  const server = http.createServer();
  await new Promise<void>((resolve) =>
    server.listen(0, '127.0.0.1', () => resolve())
  );
  const { port } = server.address() as AddressInfo;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return `http://127.0.0.1:${port}`;
}
