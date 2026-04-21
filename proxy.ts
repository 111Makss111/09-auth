import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = Boolean(
    request.cookies.get('accessToken')?.value ||
    request.cookies.get('refreshToken')?.value,
  );

  if (!isAuthenticated && matchesRoute(pathname, PRIVATE_ROUTES)) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
