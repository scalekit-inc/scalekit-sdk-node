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

This is the official Node.js SDK for [Scalekit](https://scalekit.com), — the auth stack for agents. Build secure AI products faster with authentication for humans (SSO, passwordless, full-stack auth) and agents (MCP/APIs, delegated actions), all unified on one platform.
This Node.js SDK enables both traditional B2B authentication and cutting-edge agentic workflows.
#### Agent-First Features
- **Agent Identity** — Agents as first-class actors with human ownership and org context
- **MCP-Native OAuth 2.1** — Purpose-built for Model Context Protocol with DCR/PKCE support
- **Ephemeral Credentials** — Time-bound, task-based authorization (minutes, not days)
- **Token Vault** — Per-User, Per-Tool token storage with rotation and progressive consent
- **Human-in-the-Loop** — Step-up authentication when risk crosses thresholds
- **Immutable Audit** — Track which user initiated, which agent acted, what resource was accessed
#### Human Authentication
- **Enterprise SSO** — Support for SAML and OIDC protocols
- **SCIM Provisioning** — Automated user provisioning and deprovisioning
- **Passwordless Authentication** — Magic links, OTP, and modern auth flows
- **Multi-Tenant Architecture** — Organization-level authentication policies
- **Social Logins** — Support for popular social identity providers
- **Full-Stack Auth** — Complete IdP-of-record solution for B2B SaaS
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

#### Full Stack Auth — encrypted-session middleware for Express and Next.js

The example above is for **Modular SSO**: Scalekit brokers the OAuth exchange with your customer's own IdP via a `connectionId`, and your app owns its own session however it likes.

If instead Scalekit hosts your login UI and you want it to also manage the session lifecycle for you (**Full Stack Auth**), `@scalekit-sdk/node` ships optional Express and Next.js extras that handle the encrypted session cookie, transparent token refresh, CSRF-safe login/callback, and full logout for you — no hand-rolled cookies, no manual refresh timing.

Register these under **Dashboard → Authentication → Redirects** before testing:
- **Redirect URI** — your `redirectUri` (the `/callback` path). Scalekit rejects the exchange if this doesn't match exactly.
- **Post Logout Redirect URI** — where users land after full logout. A relative path gets auto-absolutized against the request host, but the resulting absolute URL must still be registered.
- **Initiate Login URL** — your `/login` path. Scalekit redirects here (not `/callback`) for a bookmarked login page, an IdP portal tile, or an invite/magic link — `loginHandler`/`createLoginHandler` already handle this correctly, including the `idp_initiated_login` query parameter case, with no extra code required.

```bash
npm install @scalekit-sdk/node express   # or: npm install @scalekit-sdk/node next
```

```javascript
// Express
import express from "express";
import ScalekitClient from "@scalekit-sdk/node";
import { ScalekitAuth } from "@scalekit-sdk/node/express";

const client = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);
const auth = new ScalekitAuth({
  client,
  redirectUri: "https://myapp.com/callback",
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET, // openssl rand -base64 32
});

const app = express();
app.use(auth.router); // registers /login, /callback, /logout

app.get("/account", auth.requiresAuth, (req, res) => {
  res.json({ email: req.scalekitUser?.email });
});
```

```javascript
// Next.js (App Router) -- one auth instance, constructed once and re-exported
// lib/auth.js
import ScalekitClient from "@scalekit-sdk/node";
import { ScalekitAuthNext } from "@scalekit-sdk/node/next";

const client = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);
export const auth = new ScalekitAuthNext({
  client,
  redirectUri: "https://myapp.com/callback",
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET, // openssl rand -base64 32
});

// app/login/route.js
import { auth } from "../../lib/auth";
export const GET = auth.createLoginHandler();

// app/callback/route.js
import { auth } from "../../lib/auth";
export const GET = auth.createCallbackHandler();

// app/logout/route.js
import { auth } from "../../lib/auth";
export const GET = auth.createLogoutHandler();

// app/account/route.js
import { auth } from "../../lib/auth";
export const GET = auth.withAuth(async (request, { user }) => Response.json({ email: user?.email }));
```

See [`examples/express`](./examples/express) and [`examples/nextjs`](./examples/nextjs) for complete, runnable versions. For a fuller production-oriented sample app, see the framework repos in the table above.

#### ScalekitEdgeClient — for Next.js middleware on Edge Runtime

The default `ScalekitClient` (above) uses a gRPC transport and Node-only APIs, which don't work inside Next.js Edge Runtime middleware. `@scalekit-sdk/node/edge` exports `ScalekitEdgeClient`, a `fetch` + [`jose`](https://github.com/panva/jose)-based alternative covering the same auth-flow methods (`getAuthorizationUrl`, `authenticateWithCode`, `refreshAccessToken`, `validateToken`, `getLogoutUrl`, `getIdpInitiatedLoginClaims`) used by `ScalekitAuth`/`ScalekitAuthNext`. It's a drop-in `client` for either adapter — not a general replacement for `ScalekitClient`, which remains the default for everything else (organizations, connections, directories, etc.).

```javascript
// lib/auth.js (Next.js middleware, Edge Runtime)
import { ScalekitEdgeClient } from "@scalekit-sdk/node/edge";
import { ScalekitAuthNext } from "@scalekit-sdk/node/next";

const client = new ScalekitEdgeClient(
  process.env.SCALEKIT_ENV_URL,
  process.env.SCALEKIT_CLIENT_ID,
  process.env.SCALEKIT_CLIENT_SECRET
);
export const auth = new ScalekitAuthNext({
  client,
  redirectUri: "https://myapp.com/callback",
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET,
});
```

See [`examples/nextjs-edge`](./examples/nextjs-edge) for a complete, runnable version, including the `runtime: 'experimental-edge'` middleware config this requires.
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
