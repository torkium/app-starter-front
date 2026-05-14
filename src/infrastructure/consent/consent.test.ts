import { describe, expect, it } from "vitest";
import { readConsent, writeConsent } from "./consent";

describe("consent", () => {
  it("returns null when no cookie is set", () => {
    expect(readConsent()).toBeNull();
  });

  it("writes and reads a valid consent choice", () => {
    writeConsent("accepted");

    expect(document.cookie).toContain("my_app_cookie_consent=accepted");
    expect(readConsent()).toBe("accepted");
  });

  it("ignores unexpected cookie values", () => {
    document.cookie = "my_app_cookie_consent=maybe; path=/";

    expect(readConsent()).toBeNull();
  });
});
