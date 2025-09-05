<p align="left">
  <a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <img src="https://cdn.scalekit.cloud/v1/scalekit-logo-dark.svg" height="64">
    </picture>
  </a>
  <br/>
</p>

# Official Node.js SDK

[![npm version](https://img.shields.io/npm/v/@scalekit-sdk/node.svg?style=flat-square)](https://www.npmjs.com/package/@scalekit-sdk/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@scalekit-sdk/node.svg?style=flat-square)](https://www.npmjs.com/package/@scalekit-sdk/node)

<a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">Scalekit</a> is the **auth stack for AI apps** - from human authentication to agent authorization. Build secure AI products faster with authentication for humans (SSO, passwordless, full-stack auth) and agents (MCP/APIs, delegated actions), all unified on one platform. This Node.js SDK enables both traditional B2B authentication and cutting-edge agentic workflows.

## 🤖 Agent-First Features

- **🔐 Agent Identity**: Agents as first-class actors with human ownership and org context
- **🎯 MCP-Native OAuth 2.1**: Purpose-built for Model Context Protocol with DCR/PKCE support
- **⏰ Ephemeral Credentials**: Time-bound, task-based authorization (minutes, not days)
- **🔒 Token Vault**: Per-user, per-tool token storage with rotation and progressive consent
- **👥 Human-in-the-Loop**: Step-up authentication when risk crosses thresholds
- **📊 Immutable Audit**: Track which user initiated, which agent acted, what resource was accessed

## 👨‍💼 Human Authentication

- **🔐 Enterprise SSO**: Support for SAML and OIDC protocols
- **👥 SCIM Provisioning**: Automated user provisioning and deprovisioning  
- **🚀 Passwordless Authentication**: Magic links, OTP, and modern auth flows
- **🏢 Multi-tenant Architecture**: Organization-level authentication policies
- **📱 Social Logins**: Support for popular social identity providers
- **🛡️ Full-Stack Auth**: Complete IdP-of-record solution for B2B SaaS
- **🔷 TypeScript Support**: Full TypeScript definitions included

<div>
📚 <a target="_blank" href="https://docs.scalekit.com">Documentation</a> • 🚀 <a target="_blank" href="https://docs.scalekit.com/sso/quickstart/">SSO Quickstart</a> • 💻 <a target="_blank" href="https://docs.scalekit.com/apis">API Reference</a>
</div>
<hr />

## Pre-requisites

1. [Sign up](https://scalekit.com) for a Scalekit account.
2. Get your `env_url`, `client_id` and `client_secret` from the Scalekit dashboard.

<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
  <strong>Note:</strong> Our NodeJS SDK currently supports NodeJS versions >=18 as it is the min LTS version that is maintained by the NodeJS ecosystem.
</div>

## Installation

Install Scalekit SDK using your preferred package manager.

```sh
npm install @scalekit-sdk/node
#or
yarn add @scalekit-sdk/node
#or
pnpm add @scalekit-sdk/node
```

#### Minimum Requirements

The Scalekit Node.js SDK has been tested with and requires the following:

| Component | Version  |
| --------- | -------- |
| Node.js   | 16.0.0+  |

> **Note:** While Node.js 16.0.0 is the minimum requirement, we recommend using Node.js versions >=18 LTS for improved performance and long-term support.


## Usage

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
  const authUrl = scalekitClient.getAuthorizationUrl(
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

## 📱 Example Apps

Explore fully functional sample applications built with popular Node.js frameworks and the Scalekit SDK:

| Framework | Repository | Description |
|-----------|------------|-------------|
| **Express.js** | [scalekit-express-example](https://github.com/scalekit-developers/scalekit-express-example) | Basic Express.js server implementation |
| **Next.js** | [scalekit-nextjs-demo](https://github.com/scalekit-developers/scalekit-nextjs-demo) | Modern React/Next.js application |

## 🔗 Helpful Links

### 📖 Quickstart Guides
- [**SSO Integration**](https://docs.scalekit.com/sso/quickstart/) - Implement enterprise Single Sign-on
- [**Full Stack Auth**](https://docs.scalekit.com/fsa/quickstart/) - Complete authentication solution
- [**Passwordless Auth**](https://docs.scalekit.com/passwordless/quickstart/) - Modern authentication flows
- [**Social Logins**](https://docs.scalekit.com/social-logins/quickstart/) - Popular social identity providers
- [**Machine-to-Machine**](https://docs.scalekit.com/m2m/quickstart/) - API authentication

### 📚 Documentation & Reference
- [**API Reference**](https://docs.scalekit.com/apis) - Complete API documentation
- [**Developer Kit**](https://docs.scalekit.com/dev-kit/) - Tools and utilities
- [**API Authentication Guide**](https://docs.scalekit.com/guides/authenticate-scalekit-api/) - Secure API access

### 🛠️ Additional Resources
- [**Setup Guide**](https://docs.scalekit.com/guides/setup-scalekit/) - Initial platform configuration
- [**Code Examples**](https://docs.scalekit.com/directory/code-examples/) - Ready-to-use code snippets
- [**Admin Portal Guide**](https://docs.scalekit.com/directory/guides/admin-portal/) - Administrative interface
- [**Launch Checklist**](https://docs.scalekit.com/directory/guides/launch-checklist/) - Pre-production checklist

## License

This project is licensed under the **MIT license**.
See the [LICENSE](LICENSE) file for more information.
