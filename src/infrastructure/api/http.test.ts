import { describe, expect, it, vi } from "vitest";
import { buildRequestHeaders, fetchJson, withQuery } from "./http";
import { REQUEST_ID_HEADER } from "@/infrastructure/http/requestContext";

describe("http", () => {
  it("serializes query params deterministically", () => {
    expect(withQuery("/billing/plans", { page: 2, tags: ["monthly", "starter"] })).toBe(
      "/billing/plans?page=2&tags=monthly&tags=starter",
    );
  });

  it("builds request headers with auth and request id", () => {
    const headers = buildRequestHeaders('{"ok":true}', "token-123", { Accept: "application/json" }, "req-1");

    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get("Authorization")).toBe("Bearer token-123");
    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get(REQUEST_ID_HEADER)).toBe("req-1");
  });

  it("unwraps envelope payloads and forwards request id", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJson<{ ok: boolean }>("/api/test", {
        method: "GET",
        requestId: "req-42",
      }),
    ).resolves.toEqual({ ok: true });

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);

    expect(headers.get(REQUEST_ID_HEADER)).toBe("req-42");
  });
});
