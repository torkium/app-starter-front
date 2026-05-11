import { ApiError, toApiError } from "@/infrastructure/errors/apiError";
import { REQUEST_ID_HEADER, withBrowserRequestId } from "@/infrastructure/http/requestContext";
import type { ApiEnvelope, QueryParams, QueryValue } from "@/shared/types/api";
import type { HeadersInit } from "@/shared/types/http";

export interface FetchJsonOptions extends RequestInit {
  accessToken?: string | undefined;
  query?: QueryParams | undefined;
  unwrapData?: boolean | undefined;
  requestId?: string | undefined;
}

function appendQueryValue(params: URLSearchParams, key: string, value: QueryValue) {
  if (value === undefined || value === null) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      params.append(key, String(item));
    }
    return;
  }

  params.set(key, String(value));
}

export function withQuery(input: string, query?: QueryParams): string {
  if (!query || Object.keys(query).length === 0) {
    return input;
  }

  const base = input.startsWith("http") ? input : `http://localhost${input.startsWith("/") ? input : `/${input}`}`;
  const url = new URL(base);

  for (const [key, value] of Object.entries(query)) {
    appendQueryValue(url.searchParams, key, value);
  }

  if (input.startsWith("http")) {
    return url.toString();
  }

  return `${url.pathname}${url.search}`;
}

export function buildRequestHeaders(
  body: BodyInit | null | undefined,
  accessToken?: string,
  headers?: HeadersInit,
  requestId?: string,
): Headers {
  const baseHeaders = new Headers({
    ...(body !== undefined && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  });

  const mergedHeaders = new Headers(headers);
  for (const [key, value] of mergedHeaders.entries()) {
    baseHeaders.set(key, value);
  }

  if (requestId) {
    baseHeaders.set(REQUEST_ID_HEADER, requestId);
  } else if (typeof window !== "undefined" && !baseHeaders.has(REQUEST_ID_HEADER)) {
    return withBrowserRequestId(baseHeaders);
  }

  return baseHeaders;
}

function isJsonContentType(contentType: string | null): boolean {
  return contentType?.includes("application/json") ?? false;
}

function isApiEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return typeof payload === "object" && payload !== null && "data" in payload;
}

async function parsePayload<T>(response: Response, unwrapData: boolean): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (!isJsonContentType(contentType)) {
    const text = await response.text();
    return text as T;
  }

  try {
    const payload = (await response.json()) as unknown;
    if (unwrapData && isApiEnvelope<T>(payload)) {
      return payload.data;
    }
    return payload as T;
  } catch {
    throw new ApiError("Réponse JSON invalide", response.status);
  }
}

export async function fetchJson<T>(input: string, init: FetchJsonOptions = {}): Promise<T> {
  const { accessToken, headers, query, unwrapData = true, body, requestId, ...rest } = init;
  const response = await fetch(withQuery(input, query), {
    ...rest,
    body,
    headers: buildRequestHeaders(body, accessToken, headers, requestId),
    cache: rest.cache ?? "no-store",
  });

  if (!response.ok) {
    throw await toApiError(response, "Requête API impossible");
  }

  return parsePayload<T>(response, unwrapData);
}
