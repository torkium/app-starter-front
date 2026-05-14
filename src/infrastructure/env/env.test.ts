import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

describe("env", () => {
  beforeEach(() => {
    vi.resetModules();
    delete window.__MY_APP_PUBLIC_CONFIG__;
    delete process.env.API_BASE_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses public runtime config in the browser when available", async () => {
    window.__MY_APP_PUBLIC_CONFIG__ = {
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
