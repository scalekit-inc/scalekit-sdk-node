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

### ⚙️ Installation

Scalekit's Node.js SDK requires **Node.js version 18.x** or later to run. To install or upgrade Node.js, refer to the [official Node.js installation guide](https://nodejs.org/en/download). To start setting up, go to your Node project's root directory and run following command:

```sh
npm install @scalekit-sdk/node
```

Other package managers like Yarn and pnpm are also supported.

```sh
yarn add @scalekit-sdk/node
```

```sh
pnpm add @scalekit-sdk/node
```

**Note ℹ️**
SDK requires you to authenticate before you can access its authenticaiton infrastructure. Get `client_id`, `client_secret` and `env_url` from the Scalekit dashboard.

### Usage

Initialize the Scalekit client using the appropriate credentials. Refer code sample below.

```javascript
import { ScalekitClient } from "@scalekit-sdk/node";

const scalekitClient = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);

// Use the sc object to interact with the Scalekit API
const authUrl = scalekitClient.getAuthorizationUrl("https://acme-corp.com/redirect-uri", {
  state: "state",
  connectionId: "connection_id",
});

```

### Examples

#### SSO with Express.js

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
  const { code, error, error_description, idp_initiated_login } = req.query;
  // Handle error
  if (error) {
    return res.status(400).json({ error, error_description });
  }
  // Handle IdP initiated login
  if (idp_initiated_login) {
    // Get the claims from the IdP initiated login
    const { 
      connection_id, 
      organization_id, 
      login_hint, 
      relay_state 
    } = await scalekitClient.getIdpInitiatedLoginClaims(idp_initiated_login as string);
    // Get the authorization URL and redirect the user to the IdP login page
    const url = scalekitClient.getAuthorizationUrl(
      redirectUri,
      {
        connectionId: connection_id,
        organizationId: organization_id,
        loginHint: login_hint,
        ...(relay_state && { state: relay_state }),
      }
    )

   return res.redirect(url);
  }
  const authResp = await scalekitClient.authenticateWithCode(code, redirectUri);
  res.cookie("access_token", authResp.accessToken);
  return res.json(authResp.accessToken);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

### Example Apps

Fully functional sample applications written using some popular web application frameworks and Scalekit SDK. Feel free to clone the repo and run them locally.

- [Express.js](https://github.com/scalekit-inc/scalekit-express-example.git)
- [Next.js](https://github.com/scalekit-inc/scalekit-nextjs-example.git)

### API Reference

Refer to our [API reference docs](https://docs.scalekit.com/apis) for detailed information about all our API endpoints and their usage.

### More Information

- Quickstart Guide to implement Single Sign-on in your application: [SSO Quickstart Guide](https://docs.scalekit.com)
- Understand Single Sign-on basics: [SSO Basics](https://docs.scalekit.com/best-practices/single-sign-on)

### License

This project is licensed under the **MIT license**.
See the [LICENSE](LICENSE) file for more information.
