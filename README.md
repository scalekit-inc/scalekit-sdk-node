<p align="center">
  <a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img src="https://assets-global.website-files.com/65b87d98fa638289e10b8f61/65c269053d86c92e0cf91db5_scalekit-logo.svg" height="64">
    </picture>
  </a>
  <br />
</p>
<h1 align="center">
  Official Scalekit Node SDK
</h1>

Scalekit helps you in shipping enterprise auth in days.

This Node SDK is a wrapper around Scalekit's REST API to help you integrate Scalekit with your Node.js applications.

## Getting Started

1. [Sign up](https://scalekit.com) for a Scalekit account.
2. Get your ```env_url```, ```client_id``` and ```client_secret``` from the Scalekit dashboard.

## Installation

```sh
npm install @scalekit-sdk/node-sdk
#or
yarn add @scalekit-sdk/node-sdk
#or
pnpm add @scalekit-sdk/node-sdk
```

## Usage

```javascript
import { Scalekit } from "@scalekit-sdk/node";

const scalekit = new Scalekit(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);
```

## API Reference
See the [Scalekit API docs](https://docs.scalekit.com) for more information about the API and authentication.

## License
This project is licensed under the **MIT license**.
See the [LICENSE](LICENSE) file for more information.