<div align="center">

<a href="https://scalekit.com" target="_blank" rel="noopener noreferrer">
  <picture>
    <img src="https://cdn.scalekit.cloud/v1/scalekit-logo-dark.svg" height="64">
  </picture>
</a>

<p><strong>Official Node.js SDK for Scalekit — the auth stack for agents.</strong><br>
Authentication, authorization, and tool-calling for human-in-the-loop and autonomous agent flows.</p>

[![npm version](https://img.shields.io/npm/v/@scalekit-sdk/node.svg)](https://www.npmjs.com/package/@scalekit-sdk/node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/@scalekit-sdk/node.svg)](https://www.npmjs.com/package/@scalekit-sdk/node)

[![Type definitions](https://img.shields.io/npm/types/@scalekit-sdk/node.svg)](https://www.npmjs.com/package/@scalekit-sdk/node)

**[📖 Documentation](https://docs.scalekit.com)** · **[🐛 Report an Issue](https://github.com/scalekit-inc/scalekit-sdk-node/issues)** · **[💬 Join our Slack](https://join.slack.com/t/scalekit-community/shared_invite/zt-3gsxwr4hc-0tvhwT2b_qgVSIZQBQCWRw)**

</div>

---

This is the official Node.js SDK for [Scalekit](https://scalekit.com), — the auth stack for agents. Build secure AI products faster with authentication for humans (SSO, passwordless, full-stack auth) and agents (Mcp/APIs, delegated actions), all unified on one platform.
This Node.js SDK enables both traditional B2B authentication and cutting-edge agentic workflows.
#### Agent-First Features
- **Agent Identity** — Agents as first-class actors with human ownership and org context
- **Mcp-Native OAuth 2.1** — Purpose-built for Model Context Protocol with Dcr/pkce support
- **Ephemeral Credentials** — Time-bound, task-based authorization (minutes, not days)
- **Token Vault** — per-user, per-tool token storage with rotation and progressive consent
- **Human-in-the-Loop** — step-up authentication when risk crosses thresholds
- **Immutable Audit** — track which user initiated, which agent acted, what resource was accessed
#### Human Authentication
- **Enterprise SSO** — support for SAML and OIDC protocols
- **scim Provisioning** — automated user provisioning and deprovisioning
- **passwordless Authentication** — magic links, OTP, and modern auth flows
- **multi-tenant Architecture** — organization-level authentication policies
- **social Logins** — support for popular social identity providers
- **full-Stack Auth** — complete IdP-of-record solution for B2B SaaS
---
### Getting started
#### Prerequisites
- **Node.js** ≥ 18.14.1
- [Scalekit account](https://scalekit.com) with `env_url`, `client_id`, and `client_secret`
#### installation
```sh
npm install @scalekit-sdk/node
# or
yarn add @scalekit-sdk/node
# or
pnpm add @scalekit-sdk/node
```
#### Usage
```javascript
import { ScalekitClient } from "@scalekit-sdk/node";
const scalekitClient = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);
// use scalekitClient to interact with the Scalekit API
const authUrl = scalekitClient.getAuthorizationUrl("https://acme-corp.com/redirect-uri", {
  state: "state",
  connectionId: "connection_id",
});
```
---
### Example — SSO with Express.js
```javascript
import express from "express";
import { ScalekitClient } from "@scalekit-sdk/node";
const app = express();
const scalekitClient = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);
const redirectUri = `${process.env.HOST}/auth/callback`;
// get the authorization URL and redirect the user to the IdP login page
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
// handle the callback from Scalekit
app.get("/auth/callback", async (req, res) => {
  const { code, error, error_description, idp_initiated_login } = req.query;
  // handle error
  if (error) {
    return res.status(400).json({ error, error_description });
  }
  // handle IdP initiated login
  if (idp_initiated_login) {
    // get the claims from the IdP initiated login
    const {
      connection_id,
      organization_id,
      login_hint,
      relay_state
    } = await scalekitClient.getIdpInitiatedLoginClaims(idp_initiated_login as string);
    // get the authorization URL and redirect the user to the IdP login page
    const url = scalekitClient.getAuthorizationUrl(
      redirectUri,
      {
        connectionId: connection_id,
        organizationId: organization_id,
        loginHint: login_hint,
        ...(relay_state && { state: relay_state }),
      }
    );
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
| Framework | Repository | Description |
|-----------|------------|-------------|
| **Express.js** | [scalekit-express-example](https://github.com/scalekit-developers/scalekit-express-example) | Basic Express.js server implementation |
| **Next.js** | [scalekit-nextjs-demo](https://github.com/scalekit-developers/scalekit-nextjs-demo) | Modern React/Next.js application |
    **Auth.js** | [scalekit-authjs-example](https://github.com/scalekit-developers/scalekit-authjs-example) | Next.js with Auth.js (next-auth v5) |
---
### Helpful links
#### Quickstart Guides
- [SSO Integration](https://docs.scalekit.com/sso/quickstart/) — implement enterprise Single Sign-on
- [Full Stack Auth](https://docs.scalekit.com/fsa/quickstart/) — complete authentication solution
- [Passwordless Auth](https://docs.scalekit.com/passwordless/quickstart/) — modern authentication flows
- [Social Logins](https://docs.scalekit.com/social-logins/quickstart/) — popular social identity providers
- [Machine-to-Machine](https://docs.scalekit.com/m2m/quickstart/) — API authentication
#### Documentation & Reference
- [API Reference](https://docs.scalekit.com/apis) — complete API documentation
- [Developer Kit](https://docs.scalekit.com/dev-kit/) — tools and utilities
- [API authentication guide](https://docs.scalekit.com/guides/authenticate-scalekit-api/) — secure API access
#### Additional resources
- [setup Guide](https://docs.scalekit.com/guides/setup-scalekit/) — initial platform configuration
- [Code examples](https://docs.scalekit.com/directory/code-examples/) — ready-to-use code snippets
- [Admin Portal Guide](https://docs.scalekit.com/directory/guides/admin-portal/) — administrative interface
- [Launch Checklist](https://docs.scalekit.com/directory/guides/launch-checklist/) — Pre-production checklist
---
### Contributing

Contributions are welcome! Coming soon: contribution guidelines.

For now:
1. Fork this repository
2. Create a branch — `git checkout -b fix/my-improvement`
3. Make your changes
4. Run tests — `npm test`
5. Open a Pull Request

---
### License
This project is licensed under the **MIT license**. See the [LICENSE](LICENSE) file for more information.
