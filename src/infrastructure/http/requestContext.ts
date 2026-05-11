import type { HeadersInit } from "@/shared/types/http";

export const REQUEST_ID_HEADER = "x-request-id";
const BROWSER_REQUEST_ID_KEY = "starter.request_id";

function fallbackRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return fallbackRequestId();
}

export function withHeader(input: HeadersInit | undefined, key: string, value: string): Headers {
  const headers = new Headers(input);
  headers.set(key, value);
  return headers;
}

export function withRequestId(input?: HeadersInit, requestId = createRequestId()): Headers {
  return withHeader(input, REQUEST_ID_HEADER, requestId);
}

export function getOrCreateBrowserRequestId(): string {
  if (typeof window === "undefined") {
    return createRequestId();
  }

  try {
    const existing = window.sessionStorage.getItem(BROWSER_REQUEST_ID_KEY);
    if (existing) {
      return existing;
    }
  } catch {
    return createRequestId();
  }

  const created = createRequestId();

  try {
    window.sessionStorage.setItem(BROWSER_REQUEST_ID_KEY, created);
  } catch {
    return created;
  }

  return created;
}

export function withBrowserRequestId(input?: HeadersInit): Headers {
  return withRequestId(input, getOrCreateBrowserRequestId());
}
