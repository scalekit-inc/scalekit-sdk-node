import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';

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
});
