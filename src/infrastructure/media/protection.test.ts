import { describe, expect, it } from "vitest";
import { getSafeMediaUrl, isTrustedMediaUrl } from "./protection";

describe("media protection", () => {
  it("accepts relative protected media endpoints", () => {
    const contentUrl = "/api/media/assets/018f6f0e-7c4b-7f44-9f6a-6a69341b7f38/content";

    expect(isTrustedMediaUrl(contentUrl)).toBe(true);
    expect(getSafeMediaUrl(contentUrl)).toBe("/api/proxy/media/assets/018f6f0e-7c4b-7f44-9f6a-6a69341b7f38/content");
  });

  it("rejects untrusted external origins", () => {
    expect(isTrustedMediaUrl("https://evil.example.test/file.png")).toBe(false);
    expect(getSafeMediaUrl("https://evil.example.test/file.png")).toBeUndefined();
  });
});
