import { describe, expect, it } from "vitest";
import {
  REQUEST_ID_HEADER,
  createRequestId,
  getOrCreateBrowserRequestId,
  withRequestId,
} from "./requestContext";

describe("requestContext", () => {
  it("creates a stable browser request id once stored", () => {
    const first = getOrCreateBrowserRequestId();
    const second = getOrCreateBrowserRequestId();

    expect(first).toBe(second);
  });

  it("sets the request id header", () => {
    const requestId = createRequestId();
    const headers = withRequestId({ Accept: "application/json" }, requestId);

    expect(headers.get("Accept")).toBe("application/json");
    expect(headers.get(REQUEST_ID_HEADER)).toBe(requestId);
  });
});
