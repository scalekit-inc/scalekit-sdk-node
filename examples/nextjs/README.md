# Next.js (App Router) example

Minimal Next.js app using `ScalekitAuthNext` from `@scalekit-sdk/node`'s encrypted-session middleware: login, callback, protected route, full logout — with transparent token refresh handled for you.

## Setup

```bash
cp .env.example .env.local
# fill in SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET
# generate a cookie secret: openssl rand -base64 32
npm install
npm run dev
```

Register `http://localhost:5001/callback` as an allowed redirect URI (and `http://localhost:5001/` as an allowed post-logout redirect URI) in your Scalekit dashboard.

## What this demonstrates

- `app/login/route.js`, `app/callback/route.js`, `app/logout/route.js` — Route Handlers built from `createLoginHandler()` / `createCallbackHandler()` / `createLogoutHandler()`.
- `app/account/route.js` — `withAuth(...)` protecting a Route Handler; redirects to `/login` on no/invalid session (never a JSON 401), transparently refreshes an expired-but-refreshable session, and hands your handler `{ user }` from the current **access token** claims (not id_token) — so any custom claims you've configured in the Scalekit dashboard show up here, and stay fresh across refreshes.
- A wrapped handler can return a plain `Response` (like `Response.json(...)` above) or a `NextResponse` — both work.
- Full logout by default (ends the Scalekit-side session too via `id_token_hint`), not just the local cookie.

## In a real app

```bash
npm install @scalekit-sdk/node next
```

`@scalekit-sdk/node` here is installed via `file:../..` only so this example runs against your local checkout — a real project installs it from npm like any other dependency.

For a complete, production-oriented sample app (not just this minimal middleware demo), see [`scalekit-nextjs-auth-example`](https://github.com/scalekit-inc/scalekit-nextjs-auth-example).
