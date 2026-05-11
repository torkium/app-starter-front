import type { ApiProblem } from "@/shared/types/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  requestId?: string | undefined;
  title?: string | undefined;
  code?: string | undefined;
  retryAfter?: number | undefined;

  constructor(
    message: string,
    status = 500,
    details?: unknown,
    requestId?: string,
    title?: string,
    code?: string,
    retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.requestId = requestId;
    this.title = title;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export async function toApiError(response: Response, fallbackMessage: string): Promise<ApiError> {
  let payload: ApiProblem | undefined;
  try {
    payload = (await response.json()) as ApiProblem;
  } catch {
    payload = undefined;
  }

  const message = extractProblemMessage(payload, fallbackMessage);
  const requestId = payload?.requestId;
  const title = typeof payload?.title === "string" ? payload.title : undefined;
  const code = typeof payload?.code === "string" ? payload.code : undefined;
  const retryAfter = extractRetryAfter(payload, response);

  return new ApiError(message, response.status, payload, requestId, title, code, retryAfter);
}

function extractProblemMessage(payload: ApiProblem | undefined, fallbackMessage: string): string {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  const detail = typeof payload.detail === "string" ? payload.detail : undefined;
  const title = typeof payload.title === "string" ? payload.title : undefined;
  const message = typeof payload.message === "string" ? payload.message : undefined;
  const error = typeof payload.error === "string" ? payload.error : undefined;

  if (detail && title) {
    return `${title}: ${detail}`;
  }

  return detail ?? message ?? error ?? title ?? fallbackMessage;
}

function extractRetryAfter(payload: ApiProblem | undefined, response: Response): number | undefined {
  const header = response.headers.get("Retry-After");
  if (header) {
    const parsed = Number(header);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (typeof payload?.retryAfter === "number") {
    return payload.retryAfter;
  }

  if (typeof payload?.retry_after === "number") {
    return payload.retry_after;
  }

  return undefined;
}
