export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiListEnvelope<T> extends ApiEnvelope<T[]> {
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    pageCount?: number;
  };
}

export interface ApiProblem {
  title?: string;
  message?: string;
  detail?: string;
  error?: string;
  errors?: Record<string, string[]>;
  code?: string;
  status?: number;
  requestId?: string;
  retryAfter?: number;
  retry_after?: number;
  [key: string]: unknown;
}

export type PrimitiveQueryValue = string | number | boolean;
export type QueryValue = PrimitiveQueryValue | PrimitiveQueryValue[] | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
