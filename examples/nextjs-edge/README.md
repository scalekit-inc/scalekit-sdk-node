# Next.js (App Router, Edge Runtime) example

Edge-Runtime-configured sibling to [`examples/nextjs`](../nextjs): the same routes (login, callback, protected account route, full logout, transparent token refresh), but built on `ScalekitEdgeClient` from `@scalekit-sdk/node/edge` (fetch + `jose`, no gRPC, no Node-only APIs) instead of the default gRPC-based `ScalekitClient`, so `middleware.ts` can pin `runtime: 'experimental-edge'` instead of falling back to `runtime: 'nodejs'`. A real `npx next build` against this app is the proof that `ScalekitEdgeClient` actually compiles clean for Vercel/Next.js Edge Runtime.

> **Note:** the runtime value is `'experimental-edge'`, not `'edge'`. This Next.js version (16.3.x) rejects the plain `'edge'` string for the middleware/proxy runtime config at build time ("the edge runtime for rendering is currently experimental. Use runtime 'experimental-edge' instead"). See the comment in `middleware.ts` for details.

## Setup

```bash
cp .env.example .env.local
# fill in SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET
# generate a cookie secret: openssl rand -base64 32
npm install
npm run dev
```

Register these in your Scalekit dashboard: `http://localhost:5002/callback` as an allowed redirect URI, `http://localhost:5002/` as an allowed post-logout redirect URI, and `http://localhost:5002/login` as the Initiate Login URL.

This example uses `:5002` so it can sit next to Express/Next on `:5001`. Still register these URIs — they are not the same as the `:5001` examples. Run one app per registered redirect, or change `PORT` / `REDIRECT_URI` and register each extra URI.

## What this demonstrates

- `lib/auth.js` — `ScalekitEdgeClient` (`@scalekit-sdk/node/edge`) passed into `ScalekitAuthNext` (`@scalekit-sdk/node/next`), the same session-management layer used in `examples/nextjs`, now running on an Edge-Runtime-safe client.
- `middleware.ts` — `runtime: 'experimental-edge'` pinned explicitly (not the `nodejs` fallback the sibling example needs).
- `app/login/route.js`, `app/callback/route.js`, `app/logout/route.js` — Route Handlers built from `createLoginHandler()` / `createCallbackHandler()` / `createLogoutHandler()`.
- `app/account/route.js` — `withAuth(...)` protecting a Route Handler; redirects to `/login` on no/invalid session, transparently refreshes an expired-but-refreshable session, and hands your handler `{ user }` from the current access token claims.

## In a real app

```bash
npm install @scalekit-sdk/node next
```

`@scalekit-sdk/node` here is installed via `file:../..` only so this example runs against your local checkout — a real project installs it from npm like any other dependency.
