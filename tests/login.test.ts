import ScalekitClient from '../src/scalekit';
import AuthClient from '../src/auth';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AuthService } from '../src/pkg/grpc/scalekit/v1/auth/auth_pb';

describe('Auth - updateLoginUserDetails', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    // Use global client
    client = global.client;
  });

  describe('AuthClient', () => {
    it('should have auth client available', () => {
      expect(client.auth).toBeDefined();
      expect(typeof client.auth.updateLoginUserDetails).toBe('function');
    });
  });

  describe('updateLoginUserDetails', () => {
    const connectionId = process.env.SCALEKIT_TEST_CONNECTION_ID;
    const loginRequestId = process.env.SCALEKIT_TEST_LOGIN_REQUEST_ID;
    const canRun = Boolean(connectionId && loginRequestId);

    // Live test only runs when a real connection + login request are provided.
    // Never hardcode fake IDs — the RPC requires a genuine in-flight login request.
    (canRun ? it : it.skip)(
      'should return the auth request ID on successful update',
      async () => {
        const response = await client.auth.updateLoginUserDetails(
          connectionId!,
          loginRequestId!,
          {
            email: 'john.doe@company.com',
            sub: 'unique_user_id_456',
          }
        );

        expect(response).toBeDefined();
        expect(response.authRequestId).toBe(loginRequestId!);
      }
    );
  });

  describe('getLoginRequestDetails', () => {
    it('should be available on the auth client', () => {
      expect(typeof client.auth.getLoginRequestDetails).toBe('function');
    });

    it('should reject an empty login request id', async () => {
      await expect(client.auth.getLoginRequestDetails('')).rejects.toThrow(
        'loginRequestId must be a non-empty string'
      );
    });

    it('should reject a non-string login request id', async () => {
      await expect(
        client.auth.getLoginRequestDetails(undefined as unknown as string)
      ).rejects.toThrow('loginRequestId must be a non-empty string');
    });

    // Deterministic cover for the success path: proves the wrapper is bound to
    // the AuthService RPC of the same name and puts the caller's ID on the
    // request, without needing a live login request. The gated test below
    // exercises the wire; this one catches a mis-wired stub or field.
    it('should forward the login request id to the RPC and return its response', async () => {
      const rpc = jest.fn();
      const response = {} as never;
      const connectExec =
        jest.fn<(fn: unknown, request: unknown) => Promise<never>>();
      connectExec.mockResolvedValue(response);
      const createClient = jest.fn((_service: unknown) => ({
        getLoginRequestDetails: rpc,
      }));
      const auth = new AuthClient(
        { createClient } as never,
        {
          connectExec,
        } as never
      );

      const result = await auth.getLoginRequestDetails('lri_123456789');

      expect(createClient).toHaveBeenCalledWith(AuthService);
      expect(connectExec).toHaveBeenCalledWith(
        rpc,
        expect.objectContaining({ loginRequestId: 'lri_123456789' })
      );
      expect(result).toBe(response);
    });

    const loginRequestId = process.env.SCALEKIT_TEST_LOGIN_REQUEST_ID;

    // Live test only runs when a real login request is provided. Never hardcode a
    // fake ID — the RPC requires a genuine in-flight login request, and it expires
    // 15 minutes after the authorization request is handed off.
    (loginRequestId ? it : it.skip)(
      'should resolve the auth request, client and resource',
      async () => {
        const details = await client.auth.getLoginRequestDetails(
          loginRequestId!
        );

        expect(details).toBeDefined();

        // The auth request this login belongs to, with the scopes the client asked for.
        expect(details.authRequest?.id).toMatch(/^req_/);
        expect(Array.isArray(details.authRequest?.scopes)).toBe(true);

        // skClientId is always m2m_, even when clientId is a CIMD metadata URL.
        expect(details.client?.skClientId).toMatch(/^m2m_/);

        // A client registers through exactly one path, so these are never both true.
        expect(details.client?.isDcr && details.client?.isCimd).toBeFalsy();

        // resource is optional — only assert its shape when the request was scoped to one.
        if (details.resource) {
          expect(details.resource.id).toMatch(/^res_/);
          expect(typeof details.resource.name).toBe('string');
        }
      }
    );
  });
});
