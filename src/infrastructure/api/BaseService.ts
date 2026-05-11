import { createApiClient, type ApiClientOptions } from "@/infrastructure/api/client";
import type { QueryParams } from "@/shared/types/api";

export interface ServiceRequestOptions extends Omit<ApiClientOptions, "query" | "body"> {
  query?: QueryParams;
  body?: unknown;
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData || typeof body === "string" || body instanceof URLSearchParams || body instanceof Blob) {
    return body;
  }

  return JSON.stringify(body);
}

function normalizePath(basePath: string, path: string): string {
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export abstract class BaseService {
  private readonly client;

  constructor(private readonly basePath: string) {
    this.client = createApiClient(basePath);
  }

  protected async request<T>(method: string, path: string, options: ServiceRequestOptions = {}): Promise<T> {
    const { query, body, ...rest } = options;

    return this.client.request<T>(method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE", normalizePath("", path), {
      ...rest,
      query,
      body: body !== undefined ? serializeBody(body) : undefined,
    });
  }

  protected get<T>(path: string, query?: QueryParams, options?: Omit<ServiceRequestOptions, "query">): Promise<T> {
    return this.request<T>("GET", path, { ...options, query });
  }

  protected post<T, K = unknown>(path: string, body?: K, options?: ServiceRequestOptions): Promise<T> {
    return this.request<T>("POST", path, { ...options, body });
  }

  protected put<T, K = unknown>(path: string, body?: K, options?: ServiceRequestOptions): Promise<T> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  protected patch<T, K = unknown>(path: string, body?: K, options?: ServiceRequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  protected delete<T>(path: string, options?: ServiceRequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}
