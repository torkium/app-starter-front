import { fetchJson, type FetchJsonOptions } from "@/infrastructure/api/http";
import type { HttpMethod, QueryParams } from "@/shared/types/api";

export interface ApiClientOptions extends Omit<FetchJsonOptions, "method" | "query" | "body"> {
  query?: QueryParams;
  body?: BodyInit | null | undefined;
}

function normalizeBasePath(basePath: string): string {
  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

function normalizeRequestPath(basePath: string, path: string): string {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBasePath}${normalizedPath}`;
}

export function createApiClient(basePath: string) {
  return {
    request<T>(method: HttpMethod, path: string, options: ApiClientOptions = {}) {
      const { query, body, ...rest } = options;

      return fetchJson<T>(normalizeRequestPath(basePath, path), {
        ...rest,
        method,
        query,
        body,
      });
    },
  };
}
