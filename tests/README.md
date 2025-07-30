# Scalekit Node SDK Tests

This directory contains the test suite for the Scalekit Node SDK.

## Setup

1. Create a `.env` file in the root directory with the following environment variables:

```env
# Required for client initialization
SCALEKIT_ENVIRONMENT_URL= "Your Scalekit environment URL."
SCALEKIT_CLIENT_ID= " Your Scalekit environment client id "
SCALEKIT_CLIENT_SECRET= " Your Scalekit environment client secret "
```

2. Install dependencies:
```bash
npm install
```

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`

