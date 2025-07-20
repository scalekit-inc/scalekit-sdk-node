import ScalekitClient from '../src/scalekit';
import dotenv from 'dotenv';

// Import Jest globals
import { beforeAll } from '@jest/globals';

// Load environment variables
dotenv.config();

// Global test configuration
declare global {
  var client: ScalekitClient;
}

beforeAll(() => {
  // Validate required environment variables
  const environmentUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
  const clientId = process.env.SCALEKIT_CLIENT_ID;
  const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

  // Check for required environment variables
  if (!environmentUrl) {
    throw new Error('SCALEKIT_ENVIRONMENT_URL environment variable is required');
  }
  if (!clientId) {
    throw new Error('SCALEKIT_CLIENT_ID environment variable is required');
  }
  if (!clientSecret) {
    throw new Error('SCALEKIT_CLIENT_SECRET environment variable is required');
  }

  // Initialize test client
  global.client = new ScalekitClient(environmentUrl, clientId, clientSecret);
}); 