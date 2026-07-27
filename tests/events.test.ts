import ScalekitClient from '../src/scalekit';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Events', () => {
  let client: ScalekitClient;

  beforeEach(() => {
    // Use global client
    client = global.client;
  });

  describe('EventsClient', () => {
    it('should have events client available', () => {
      expect(client.events).toBeDefined();
      expect(typeof client.events.listEventsPaginated).toBe('function');
    });
  });

  describe('Events API Integration Tests', () => {
    describe('listEventsPaginated', () => {
      it('should return a paginated page of events', async () => {
        const response = await client.events.listEventsPaginated(10, '');

        expect(response).toBeDefined();
        // Events list may be empty for a fresh environment - that is a valid response.
        expect(Array.isArray(response.events)).toBe(true);
        // Reading the page tokens must not throw regardless of whether more pages exist.
        expect(() => response.nextPageToken).not.toThrow();
        expect(() => response.prevPageToken).not.toThrow();
      });
    });
  });
});
