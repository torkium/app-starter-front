import { describe, expect, it } from "vitest";
import { toApiError } from "./apiError";

describe("apiError", () => {
  it("extracts title, detail, request id and retry-after", async () => {
    const response = new Response(
      JSON.stringify({
        title: "Too Many Requests",
        detail: "Slow down",
        requestId: "req-99",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/problem+json",
          "Retry-After": "120",
        },
      },
    );

    const error = await toApiError(response, "Fallback");

    expect(error.message).toBe("Too Many Requests: Slow down");
    expect(error.status).toBe(429);
    expect(error.requestId).toBe("req-99");
    expect(error.retryAfter).toBe(120);
    expect(error.title).toBe("Too Many Requests");
  });

  it("falls back cleanly on invalid json payloads", async () => {
    const response = new Response("upstream exploded", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });

    const error = await toApiError(response, "Proxy failure");

    expect(error.message).toBe("Proxy failure");
    expect(error.status).toBe(502);
  });
});
