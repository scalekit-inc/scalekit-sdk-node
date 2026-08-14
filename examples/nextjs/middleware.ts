import { auth } from './lib/auth';

export default auth.createMiddleware({
  publicRoutes: ['/'],
});

export const config = {
  // ScalekitClient (its User-Agent construction in core.ts, and its gRPC
  // transport) isn't Edge-Runtime-compatible today -- explicit nodejs
  // runtime, not the Edge default, so this actually builds/deploys.
  runtime: 'nodejs',
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
