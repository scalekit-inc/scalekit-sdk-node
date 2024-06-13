<p align="center">
  <a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img src="https://cdn.scalekit.cloud/v1/scalekit-logo-dark.svg" height="64">
    </picture>
  </a>
  <br/>
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
npm install @scalekit-sdk/node
#or
yarn add @scalekit-sdk/node
#or
pnpm add @scalekit-sdk/node
```

## Usage

```javascript
import { ScalekitClient } from "@scalekit-sdk/node";

const sc = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);

// Use the sc object to interact with the Scalekit API
const authUrl = sc.getAuthorizationUrl("https://acme-corp.com/redirect-uri", {
  state: "state",
  connectionId: "connection_id",
});

```

## Examples - SSO with Express.js

```javascript
import express from "express";
import { ScalekitClient } from "@scalekit-sdk/node";

const app = express();

const sc = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);

const redirectUri = `${process.env.HOST}/auth/callback`;

// Get the authorization URL and redirect the user to the IdP login page
app.get("/auth/login", (req, res) => {
  const authUrl = sc.getAuthorizationUrl(
    redirectUri, 
    {
      state: "state",
      connectionId: "connection_id",
    }
  );

  res.redirect(authUrl);
});

// Handle the callback from the Scalekit 
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  const authResp = await sc.authenticateWithCode(code, redirectUri);
  res.cookie("access_token", authResp.accessToken);
  res.json(token);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Sample Apps  

- [Express.js](https://github.com/scalekit-inc/scalekit-express-example.git)
- [Next.js](https://github.com/scalekit-inc/scalekit-nextjs-example.git)

## API Reference

See the [Scalekit API docs](https://docs.scalekit.com/apis) for more information about the API and authentication.

## More Information

- [SSO Quickstart Guide](https://docs.scalekit.com)
- [SSO Basics](https://docs.scalekit.com/best-practices/single-sign-on)
- [ID Token](https://docs.scalekit.com/best-practices/idtoken-claims)

## License

This project is licensed under the **MIT license**.
See the [LICENSE](LICENSE) file for more information.
