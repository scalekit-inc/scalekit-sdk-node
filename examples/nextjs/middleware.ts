import { auth } from './lib/auth';

export default auth.createMiddleware({
  publicRoutes: ['/'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
