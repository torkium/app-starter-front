import { beforeEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  beforeEach(() => {
    vi.resetModules();
    delete window.__STARTER_PUBLIC_CONFIG__;
  });

  it("uses public runtime config in the browser when available", async () => {
    window.__STARTER_PUBLIC_CONFIG__ = {
      NEXT_PUBLIC_APP_URL: "https://runtime.example.test",
    };

    const { env } = await import("./env");

    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://runtime.example.test");
  });

  it("falls back to defaults when runtime config is absent", async () => {
    const { env } = await import("./env");

    expect(env.API_BASE_URL).toBe("http://back:8080/api");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });
});
