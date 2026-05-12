import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from "@/infrastructure/auth/cookies";
import { env, isProduction } from "@/infrastructure/env/env";
import { REQUEST_ID_HEADER, createRequestId } from "@/infrastructure/http/requestContext";
import { isJwtExpired } from "@/shared/utils/jwt";

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

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "content-encoding",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const ALLOWED_REQUEST_HEADERS = new Set([
  "accept",
  "accept-language",
  "content-type",
  "if-match",
  "if-none-match",
  "if-modified-since",
  "if-unmodified-since",
  "range",
  "x-upload-token",
]);
const ALLOWED_PROXY_PREFIXES = [
  "account/me",
  "account/realtime/authorize",
  "billing/",
  "media/",
  "notifications/push/subscriptions",
];

function buildTarget(path: string[]): string {
  const normalized = path.map((segment) => encodeURIComponent(segment)).join("/");
  return `${env.API_BASE_URL}/${normalized}`;
}

function isAllowedProxyPath(path: string[]): boolean {
  const normalized = path.join("/");
  return ALLOWED_PROXY_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(prefix));
}

function normalizeProxyPath(path: string[]): string[] | null {
  if (path.length === 0) {
    return null;
  }

  const normalizedPath: string[] = [];

  for (const segment of path) {
    let decodedSegment: string;

    try {
      decodedSegment = decodeURIComponent(segment);
    } catch {
      return null;
    }

    if (
      decodedSegment === "" ||
      decodedSegment === "." ||
      decodedSegment === ".." ||
      decodedSegment.includes("/") ||
      decodedSegment.includes("\\") ||
      decodedSegment.includes("?") ||
      decodedSegment.includes("#")
    ) {
      return null;
    }

    normalizedPath.push(decodedSegment);
  }

  return normalizedPath;
}

function getForwardHeaders(request: NextRequest, accessToken?: string): Headers {
  const forwarded = new Headers();
  for (const [key, value] of request.headers.entries()) {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower) || lower === "cookie" || !ALLOWED_REQUEST_HEADERS.has(lower)) {
      continue;
    }
    forwarded.set(lower, value);
  }

  if (accessToken) {
    forwarded.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!forwarded.has(REQUEST_ID_HEADER)) {
    forwarded.set(REQUEST_ID_HEADER, request.headers.get(REQUEST_ID_HEADER) ?? createRequestId());
  }

  return forwarded;
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

    return {
      kind: "ok",
      tokens: (await response.json()) as AuthTokensResponse,
    };
  } catch {
    return { kind: "transient_failed" };
  }
}

async function resolveAccessToken(requestId: string): Promise<{
  accessToken?: string;
  refreshedTokens?: AuthTokensResponse;
  clearSession: boolean;
  refreshState: RefreshResult["kind"] | "not_attempted";
}> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (accessToken && !isJwtExpired(accessToken)) {
    return { accessToken, clearSession: false, refreshState: "not_attempted" };
  }

  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return { clearSession: Boolean(accessToken), refreshState: "not_attempted" };
  }

  const refreshResult = await refreshAccessToken(refreshToken, requestId);
  if (refreshResult.kind === "auth_failed") {
    return { clearSession: true, refreshState: refreshResult.kind };
  }

  if (refreshResult.kind === "transient_failed" || !refreshResult.tokens.access_token) {
    return { clearSession: false, refreshState: refreshResult.kind };
  }

  return {
    accessToken: refreshResult.tokens.access_token,
    refreshedTokens: refreshResult.tokens,
    clearSession: false,
    refreshState: refreshResult.kind,
  };
}

async function sendToBackend(
  request: NextRequest,
  path: string[],
  body: ArrayBuffer | undefined,
  accessToken?: string,
): Promise<Response> {
  const target = new URL(buildTarget(path));
  target.search = request.nextUrl.search;
  const init: RequestInit = {
    method: request.method,
    headers: getForwardHeaders(request, accessToken),
    cache: "no-store",
  };

  if (body !== undefined) {
    init.body = body;
  }

  return fetch(target.toString(), init);
}

function applySessionCookies(response: NextResponse, tokens: AuthTokensResponse): void {
  if (tokens.access_token) {
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in ?? 60 * 60,
    });
  }

  if (tokens.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  if (tokens.session_id) {
    response.cookies.set(SESSION_COOKIE, tokens.session_id, {
      httpOnly: true,
      secure: isProduction,
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
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

function buildResponseHeaders(response: Response): Headers {
  const headers = new Headers();

  for (const [key, value] of response.headers.entries()) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase()) || key.toLowerCase() === "set-cookie") {
      continue;
    }
    headers.append(key, value);
  }

  headers.set("Cache-Control", "no-store");

  return headers;
}

async function proxyRequest(request: NextRequest, path: string[]): Promise<NextResponse> {
  const requestId = request.headers.get(REQUEST_ID_HEADER) ?? createRequestId();
  const normalizedPath = normalizeProxyPath(path);

  if (!normalizedPath || !isAllowedProxyPath(normalizedPath)) {
    return NextResponse.json({ error: "Proxy path not allowed" }, { status: 404, headers: { [REQUEST_ID_HEADER]: requestId } });
  }

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const session = await resolveAccessToken(requestId);
  let accessToken = session.accessToken;
  let refreshedTokens = session.refreshedTokens;
  let clearSession = session.clearSession;
  let refreshState = session.refreshState;

  if (!accessToken) {
    const unauthorizedResponse = NextResponse.json(
      { error: "Authentication required" },
      { status: 401, headers: { "Cache-Control": "no-store", [REQUEST_ID_HEADER]: requestId } },
    );

    if (clearSession) {
      clearSessionCookies(unauthorizedResponse);
    }

    return unauthorizedResponse;
  }

  let response = await sendToBackend(request, normalizedPath, body, accessToken);
  if ((response.status === 401 || response.status === 403) && !refreshedTokens) {
    const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      const refreshResult = await refreshAccessToken(refreshToken, requestId);
      if (refreshResult.kind === "ok" && refreshResult.tokens.access_token) {
        refreshedTokens = refreshResult.tokens;
        accessToken = refreshResult.tokens.access_token;
        refreshState = refreshResult.kind;
        response = await sendToBackend(request, normalizedPath, body, accessToken);
      } else if (refreshResult.kind === "auth_failed") {
        refreshState = refreshResult.kind;
        clearSession = true;
      } else {
        refreshState = refreshResult.kind;
      }
    }
  }

  if ((response.status === 401 || response.status === 403) && refreshState !== "transient_failed") {
    clearSession = true;
  }

  const proxiedResponse = new NextResponse(response.body, {
    status: response.status,
    headers: buildResponseHeaders(response),
  });
  proxiedResponse.headers.set(REQUEST_ID_HEADER, response.headers.get(REQUEST_ID_HEADER) ?? requestId);

  if (refreshedTokens) {
    applySessionCookies(proxiedResponse, refreshedTokens);
  } else if (clearSession) {
    clearSessionCookies(proxiedResponse);
  }

  return proxiedResponse;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
