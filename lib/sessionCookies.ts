import type { NextResponse } from 'next/server';
import { parse } from 'cookie';

type SetCookieHeader = string | string[] | undefined;

const COOKIE_ATTRIBUTE_NAMES = new Set([
  'domain',
  'expires',
  'httponly',
  'max-age',
  'path',
  'priority',
  'samesite',
  'secure',
  'partitioned',
]);

type ParsedSetCookie = {
  name: string;
  value: string;
  options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
  };
};

const normalizeMaxAge = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const parseSetCookieHeader = (
  setCookieHeader: SetCookieHeader,
): ParsedSetCookie[] => {
  if (!setCookieHeader) {
    return [];
  }

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  return cookieArray.flatMap((cookieString) => {
    const parsedCookie = parse(cookieString);

    return Object.entries(parsedCookie).reduce<ParsedSetCookie[]>(
      (cookies, [name, value]) => {
        if (
          COOKIE_ATTRIBUTE_NAMES.has(name.toLowerCase()) ||
          typeof value !== 'string'
        ) {
          return cookies;
        }

        cookies.push({
          name,
          value,
          options: {
            expires: parsedCookie.Expires
              ? new Date(parsedCookie.Expires)
              : undefined,
            maxAge: normalizeMaxAge(parsedCookie['Max-Age']),
            path: parsedCookie.Path,
          },
        });

        return cookies;
      },
      [],
    );
  });
};

export const mergeCookieHeader = (
  cookieHeader: string,
  setCookieHeader: SetCookieHeader,
) => {
  const cookiesMap = parse(cookieHeader || '');

  for (const cookie of parseSetCookieHeader(setCookieHeader)) {
    cookiesMap[cookie.name] = cookie.value;
  }

  return Object.entries(cookiesMap)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
};

export const applyResponseCookies = (
  response: NextResponse,
  setCookieHeader: SetCookieHeader,
) => {
  for (const cookie of parseSetCookieHeader(setCookieHeader)) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
};
