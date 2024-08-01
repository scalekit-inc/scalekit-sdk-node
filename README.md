<h1 align="center">
  <a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">
    <picture >
      <img src="https://cdn.scalekit.cloud/v1/scalekit-logo-dark.svg" height="50" style="padding: 1rem;">
    </picture>
  </a>
  <br/>
    <a href="https://www.npmjs.com/package/@scalekit-sdk/node">
    <img src="https://img.shields.io/npm/v/@scalekit-sdk/node.svg?color=a173ff&style=for-the-badge">
  </a>
  <a href="https://www.scalekit.com/?intent=earlyaccess&utm_source=docs">
  <img src="https://img.shields.io/badge/Get_Early_Access-4f5eff?style=for-the-badge&labelColor=a173ff&color=a173ff">
  </a>
  <a>
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/%40scalekit-sdk%2Fnode?style=for-the-badge&color=a173ff">
  </a>
    <a href="https://docs.scalekit.com">
    <img src="https://img.shields.io/badge/%F0%9F%92%A1%20-docs-a173ff.svg?style=for-the-badge">
  </a>
</h1>

<p align="center">
  <em><a href="https://scalekit.com">Scalekit</a> is your gateway to <b>enterprise-readiness</b> for B2B and SaaS applications. Built on <a href="https://openid.net/">OpenID</a> and <a href="https://en.wikipedia.org/wiki/SAML_2.0">SAML</a> standards, it provides seamless <b>authentication</b>, <b>user management</b>, and <b>access control</b> capabilities. Scalekit helps you comply with <b>GDPR</b>, <b>SOC2</b>, and <b>HIPAA</b> standards, enabling you to focus on <b>core product development</b> while we handle the complexities of <b>enterprise security</b> and <b>compliance</b>.</em>
</p>

---

## Pre-requisites

1. [Sign up](https://scalekit.com) for a Scalekit account.
2. Get your `env_url`, `client_id` and `client_secret` from the Scalekit dashboard.

## Installation

Install Scalekit SDK using your preferred package manager.

```sh
npm install @scalekit-sdk/node
#or
yarn add @scalekit-sdk/node
#or
pnpm add @scalekit-sdk/node
```

## Usage

Initialize the Scalekit client using the appropriate credentials. Refer code sample below.

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

Below is a simple code sample that showcases how to implement Single Sign-on using Scalekit SDK

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

// Handle the callback from Scalekit
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code as string;
  const authResp = await sc.authenticateWithCode(code, redirectUri);
  res.cookie("access_token", authResp.accessToken);
  res.json(authResp.accessToken);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## Example Apps

Fully functional sample applications written using some popular web application frameworks and Scalekit SDK. Feel free to clone the repo and run them locally.

- [Express.js](https://github.com/scalekit-inc/scalekit-express-example.git)
- [Next.js](https://github.com/scalekit-inc/scalekit-nextjs-example.git)

## API Reference

Refer to our [API reference docs](https://docs.scalekit.com/apis) for detailed information about all our API endpoints and their usage.

## More Information

- Quickstart Guide to implement Single Sign-on in your application: [SSO Quickstart Guide](https://docs.scalekit.com)
- Understand Single Sign-on basics: [SSO Basics](https://docs.scalekit.com/best-practices/single-sign-on)

## License

This project is licensed under the **MIT license**.
See the [LICENSE](LICENSE) file for more information.
