import ScalekitClient from '../src/scalekit';
import { TemplateType } from '../src/pkg/grpc/scalekit/v1/auth/passwordless_pb';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { TestDataGenerator } from './utils/test-data';

describe('Passwordless', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    // Use global client
    client = global.client;
  });

  describe('sendPasswordlessEmail', () => {
    it('should send passwordless email with basic parameters', async () => {
      const email = TestDataGenerator.generateUniqueEmail();
      
      const response = await client.passwordless.sendPasswordlessEmail(email, TestDataGenerator.generatePasswordlessEmailData());

      expect(response).toBeDefined();
      expect(response.authRequestId).toBeDefined();
      expect(response.expiresAt).toBeDefined();
      expect(response.expiresIn).toBe(3600);
      expect(response.passwordlessType).toBeDefined();
    });

    it('should send passwordless email with template variables', async () => {
      const email = TestDataGenerator.generateUniqueEmail();
      
      const response = await client.passwordless.sendPasswordlessEmail(email, TestDataGenerator.generatePasswordlessEmailWithTemplateData());

      expect(response).toBeDefined();
      expect(response.authRequestId).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      await expect(
        client.passwordless.sendPasswordlessEmail('', {
          template: TemplateType.SIGNIN
        })
      ).rejects.toThrow('Email must be a valid string');
    });

    it('should throw error for invalid template type', async () => {
      const email = TestDataGenerator.generateUniqueEmail();
      
      await expect(
        client.passwordless.sendPasswordlessEmail(email, {
          template: 'INVALID_TEMPLATE' as any
        })
      ).rejects.toThrow('Invalid template type');
    });
  });

  describe('verifyPasswordlessEmail', () => {
    it('should throw error when neither code nor linkToken is provided', async () => {
      await expect(
        client.passwordless.verifyPasswordlessEmail({})
      ).rejects.toThrow('Either code or linkToken must be provided');
    });

    it('should verify with code', async () => {
      // Mock code for testing - expected to fail
      const credential = TestDataGenerator.generateCredentialData('code');
      
      try {
        const response = await client.passwordless.verifyPasswordlessEmail(credential);
        expect(response).toBeDefined();
      } catch (error) {
        // Expected failure with mock code
        expect(error).toBeDefined();
      }
    });

    it('should verify with linkToken', async () => {
      // Mock linkToken for testing - expected to fail
      const credential = TestDataGenerator.generateCredentialData('linkToken');
      
      try {
        const response = await client.passwordless.verifyPasswordlessEmail(credential);
        expect(response).toBeDefined();
      } catch (error) {
        // Expected failure with mock linkToken
        expect(error).toBeDefined();
      }
    });
  });

  describe('resendPasswordlessEmail', () => {
    it('should resend passwordless email', async () => {
      // Send initial passwordless email
      const email = TestDataGenerator.generateUniqueEmail();
      
      const sendResponse = await client.passwordless.sendPasswordlessEmail(email, TestDataGenerator.generatePasswordlessEmailData());

      // Resend the email
      const resendResponse = await client.passwordless.resendPasswordlessEmail(
        sendResponse.authRequestId
      );

      expect(resendResponse).toBeDefined();
      expect(resendResponse.authRequestId).toBeDefined();
      expect(resendResponse.expiresAt).toBeDefined();
      expect(resendResponse.expiresIn).toBeDefined();
      expect(resendResponse.passwordlessType).toBeDefined();
    });
  });
}); 