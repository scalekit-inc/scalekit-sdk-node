# Express example

Minimal Express app using `ScalekitAuth` from `@scalekit-sdk/node`'s encrypted-session middleware: login, callback, protected route, full logout — with transparent token refresh handled for you.

## Setup

```bash
cp .env.example .env
# fill in SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET
# generate a cookie secret: openssl rand -base64 32
npm install
npm start
```

Register `http://localhost:5001/callback` as an allowed redirect URI (and `http://localhost:5001/` as an allowed post-logout redirect URI) in your Scalekit dashboard.

## What this demonstrates

- `auth.router` — mounts `/login`, `/callback`, `/logout` for you.
- `auth.requiresAuth` — protects a route; redirects to `/login` on no/invalid session (never a JSON 401), transparently refreshes an expired-but-refreshable session.
- `req.scalekitUser` — claims from the current **access token** (not id_token), so any custom claims you've configured in the Scalekit dashboard show up here, and stay fresh across refreshes.
- Full logout by default (ends the Scalekit-side session too via `id_token_hint`), not just the local cookie.

## In a real app

```bash
npm install @scalekit-sdk/node express
```

`@scalekit-sdk/node` here is installed via `file:../..` only so this example runs against your local checkout — a real project installs it from npm like any other dependency.

For a complete, production-oriented sample app (not just this minimal middleware demo), see [`scalekit-express-auth-example`](https://github.com/scalekit-inc/scalekit-express-auth-example).
