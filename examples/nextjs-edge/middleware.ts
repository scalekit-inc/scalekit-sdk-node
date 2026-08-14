import { auth } from './lib/auth';

export default auth.createMiddleware({
  publicRoutes: ['/'],
});

export const config = {
  // ScalekitEdgeClient is fetch+jose based (no gRPC, no os/process User-Agent
  // construction) -- Edge Runtime, not the nodejs fallback the sibling
  // examples/nextjs app needs for ScalekitClient. This Next.js version
  // (16.3.x) requires the literal string 'experimental-edge' for the
  // middleware/proxy runtime config value -- plain 'edge' is rejected at
  // build time ("the edge runtime for rendering is currently
  // experimental. Use runtime 'experimental-edge' instead").
  runtime: 'experimental-edge',
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
