import { describe, expect, it } from "vitest";
import { getSafeMediaUrl, isTrustedMediaUrl } from "./protection";

describe("media protection", () => {
  it("accepts relative protected media endpoints", () => {
    expect(isTrustedMediaUrl("/api/media/assets/123/content")).toBe(true);
    expect(getSafeMediaUrl("/api/media/assets/123/content")).toBe("/api/media/assets/123/content");
  });

  it("rejects untrusted external origins", () => {
    expect(isTrustedMediaUrl("https://evil.example.test/file.png")).toBe(false);
    expect(getSafeMediaUrl("https://evil.example.test/file.png")).toBeUndefined();
  });
});
