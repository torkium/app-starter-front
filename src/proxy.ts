import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { REQUEST_ID_HEADER, createRequestId } from "@/infrastructure/http/requestContext";
import { env } from "@/infrastructure/env/env";
import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from "@/infrastructure/auth/cookies";

interface AuthTokensResponse {
  access_token?: string;
  refresh_token?: string;
  session_id?: string;
  expires_in?: number;
}

type RefreshResult =
  | { kind: "ok"; tokens: AuthTokensResponse }
  | { kind: "auth_failed" }
  | { kind: "transient_failed" };

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/confirm-email-change",
  "/logout",
  "/cgu",
  "/charte",
];
const NONCE_HEADER = "x-nonce";
const PUBLIC_ASSET_PATHS = ["/favicon.ico", "/manifest.webmanifest", "/runtime-config.js", "/sw.js"];
const PUBLIC_ASSET_PREFIXES = ["/brand/", "/images/", "/icons/"];
const PUBLIC_AUTHENTICATED_PATHS = ["/cgu", "/charte", "/logout"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isPublicAssetPath(pathname: string): boolean {
  return PUBLIC_ASSET_PATHS.includes(pathname) || PUBLIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicAuthenticatedPath(pathname: string): boolean {
  return PUBLIC_AUTHENTICATED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function hasUsableAccessToken(token?: string): boolean {
  if (!token) {
    return false;
  }

  const payload = token.split(".")[1];
  if (!payload) {
    return false;
  }

  try {
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    if (typeof decoded.exp !== "number") {
      return true;
    }

    return decoded.exp * 1000 > Date.now() + 30_000;
  } catch {
    return false;
  }
}

async function refreshAccessToken(refreshToken: string, requestId: string): Promise<RefreshResult> {
  try {
    const response = await fetch(`${env.API_BASE_URL}${env.API_REFRESH_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [REQUEST_ID_HEADER]: requestId,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      return { kind: "auth_failed" };
    }

    if (!response.ok) {
      return { kind: "transient_failed" };
    }

    return { kind: "ok", tokens: (await response.json()) as AuthTokensResponse };
  } catch {
    return { kind: "transient_failed" };
  }
}

function applySessionCookies(response: NextResponse, tokens: AuthTokensResponse): void {
  if (tokens.access_token) {
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in ?? 60 * 60,
    });
  }

  if (tokens.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  if (tokens.session_id) {
    response.cookies.set(SESSION_COOKIE, tokens.session_id, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

function clearSessionCookies(response: NextResponse): void {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

function buildLoginRedirectUrl(request: NextRequest): URL {
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return url;
}

function toOrigin(input: string | undefined): string | null {
  if (!input) {
    return null;
  }

  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

function buildSecurityHeaders(request: NextRequest, nonce: string): Headers {
  const isProduction = process.env.NODE_ENV === "production";
  const appOrigin = request.nextUrl.origin;
  const mercureOrigin = toOrigin(env.NEXT_PUBLIC_MERCURE_URL);
  const mediaOrigin = toOrigin(env.NEXT_PUBLIC_MEDIA_BASE_URL);
  const mediaUploadOrigin = toOrigin(env.NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL);

  const connectSrc = new Set(["'self'", appOrigin]);
  const imgSrc = new Set(["'self'", "blob:"]);
  const mediaSrc = new Set(["'self'", "blob:"]);
  const scriptSrc = new Set(["'self'", `'nonce-${nonce}'`]);

  for (const origin of [mercureOrigin, mediaOrigin, mediaUploadOrigin]) {
    if (origin) {
      connectSrc.add(origin);
    }
  }

  if (mediaOrigin) {
    imgSrc.add(mediaOrigin);
    mediaSrc.add(mediaOrigin);
  }

  if (!isProduction) {
    connectSrc.add("http:");
    connectSrc.add("https:");
    connectSrc.add("ws:");
    connectSrc.add("wss:");
    imgSrc.add("http:");
    imgSrc.add("https:");
    mediaSrc.add("http:");
    mediaSrc.add("https:");
    scriptSrc.add("'unsafe-inline'");
    scriptSrc.add("'unsafe-eval'");
  }

  const headers = new Headers();
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      `connect-src ${Array.from(connectSrc).join(" ")}`,
      `img-src ${Array.from(imgSrc).join(" ")}`,
      `media-src ${Array.from(mediaSrc).join(" ")}`,
      "font-src 'self' data: https://fonts.gstatic.com",
      "style-src 'self' https://fonts.googleapis.com",
      "style-src-elem 'self' https://fonts.googleapis.com",
      "style-src-attr 'unsafe-inline'",
      `script-src ${Array.from(scriptSrc).join(" ")}`,
    ].join("; "),
  );
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self), payment=(self)");

  if (isProduction) {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return headers;
}

function applySecurityHeaders(response: NextResponse, request: NextRequest, nonce: string): NextResponse {
  for (const [key, value] of buildSecurityHeaders(request, nonce).entries()) {
    response.headers.set(key, value);
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = btoa(crypto.randomUUID());
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  const authenticatedForGuard = hasUsableAccessToken(accessToken);
  const requestId = request.headers.get(REQUEST_ID_HEADER) ?? createRequestId();
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set(REQUEST_ID_HEADER, requestId);
  forwardedHeaders.set(NONCE_HEADER, nonce);

  const nextResponse = NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  });
  nextResponse.headers.set(REQUEST_ID_HEADER, requestId);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    isPublicAssetPath(pathname)
  ) {
    return applySecurityHeaders(nextResponse, request, nonce);
  }

  if (!authenticatedForGuard && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken, requestId);

    if (refreshResult.kind === "ok" && hasUsableAccessToken(refreshResult.tokens.access_token)) {
      const target = isPublicPath(pathname) && pathname !== "/confirm-email-change" && !isPublicAuthenticatedPath(pathname)
        ? new URL("/dashboard", request.url)
        : request.nextUrl;
      const refreshResponse = NextResponse.redirect(target);
      refreshResponse.headers.set(REQUEST_ID_HEADER, requestId);
      applySessionCookies(refreshResponse, refreshResult.tokens);
      return applySecurityHeaders(refreshResponse, request, nonce);
    }

    if (refreshResult.kind === "auth_failed") {
      const clearResponse = isPublicPath(pathname)
        ? nextResponse
        : NextResponse.redirect(buildLoginRedirectUrl(request));
      clearResponse.headers.set(REQUEST_ID_HEADER, requestId);
      clearSessionCookies(clearResponse);
      return applySecurityHeaders(clearResponse, request, nonce);
    }
  }

  if (!authenticatedForGuard && !isPublicPath(pathname)) {
    const url = buildLoginRedirectUrl(request);
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set(REQUEST_ID_HEADER, requestId);
    return applySecurityHeaders(redirectResponse, request, nonce);
  }

  return applySecurityHeaders(nextResponse, request, nonce);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr).*)"],
};
