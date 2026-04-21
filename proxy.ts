import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';
import { applyResponseCookies, mergeCookieHeader } from './lib/sessionCookies';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  let isAuthenticated = Boolean(accessToken);
  let shouldClearCookies = false;
  let cookieHeader = request.headers.get('cookie') ?? '';
  let setCookieHeader: string | string[] | undefined;

  if (!isAuthenticated && refreshToken) {
    try {
      const sessionResponse = await checkSession(cookieHeader);

      isAuthenticated = Boolean(sessionResponse.data?.success);

      if (isAuthenticated) {
        setCookieHeader = sessionResponse.headers['set-cookie'];
        cookieHeader = mergeCookieHeader(cookieHeader, setCookieHeader);
      } else {
        shouldClearCookies = true;
      }
    } catch {
      shouldClearCookies = true;
    }
  }

  const buildResponse = (response: NextResponse) => {
    if (setCookieHeader) {
      applyResponseCookies(response, setCookieHeader);
    }

    if (shouldClearCookies) {
      clearAuthCookies(response);
    }

    return response;
  };

  if (!isAuthenticated && matchesRoute(pathname, PRIVATE_ROUTES)) {
    return buildResponse(NextResponse.redirect(new URL('/sign-in', request.url)));
  }

  if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
    return buildResponse(NextResponse.redirect(new URL('/profile', request.url)));
  }

  const requestHeaders = new Headers(request.headers);

  if (cookieHeader) {
    requestHeaders.set('cookie', cookieHeader);
  } else {
    requestHeaders.delete('cookie');
  }

  return buildResponse(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
  );
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
