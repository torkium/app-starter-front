import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { REQUEST_ID_HEADER, createRequestId } from "@/infrastructure/http/requestContext";
import { env } from "@/infrastructure/env/env";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
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

function buildSecurityHeaders(request: NextRequest): Headers {
  const isProduction = process.env.NODE_ENV === "production";
  const appOrigin = request.nextUrl.origin;
  const mercureOrigin = toOrigin(env.NEXT_PUBLIC_MERCURE_URL);
  const mediaOrigin = toOrigin(env.NEXT_PUBLIC_MEDIA_BASE_URL);
  const mediaUploadOrigin = toOrigin(env.NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL);

  const connectSrc = new Set(["'self'", appOrigin]);
  const imgSrc = new Set(["'self'", "blob:"]);
  const mediaSrc = new Set(["'self'", "blob:"]);

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
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self'",
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

function applySecurityHeaders(response: NextResponse, request: NextRequest): NextResponse {
  for (const [key, value] of buildSecurityHeaders(request).entries()) {
    response.headers.set(key, value);
  }

  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("starter_access_token")?.value;
  const refreshToken = request.cookies.get("starter_refresh_token")?.value;
  const authenticatedForGuard = hasUsableAccessToken(accessToken) || Boolean(refreshToken);
  const requestId = request.headers.get(REQUEST_ID_HEADER) ?? createRequestId();
  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set(REQUEST_ID_HEADER, requestId);

  const nextResponse = NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  });
  nextResponse.headers.set(REQUEST_ID_HEADER, requestId);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico"
  ) {
    return applySecurityHeaders(nextResponse, request);
  }

  if (!authenticatedForGuard && !isPublicPath(pathname)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set(REQUEST_ID_HEADER, requestId);
    return applySecurityHeaders(redirectResponse, request);
  }

  if (hasUsableAccessToken(accessToken) && isPublicPath(pathname) && pathname !== "/") {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    redirectResponse.headers.set(REQUEST_ID_HEADER, requestId);
    return applySecurityHeaders(redirectResponse, request);
  }

  return applySecurityHeaders(nextResponse, request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
