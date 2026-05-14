import { describe, expect, it } from "vitest";
import { validateRegisterForm } from "@/domains/auth/registerValidation";

function formData(fields: Record<string, string>): FormData {
  const data = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    data.set(key, value);
  });

  return data;
}

describe("validateRegisterForm", () => {
  it("returns the registration payload when passwords match and legal checks are accepted", () => {
    const result = validateRegisterForm(formData({
      email: " hello@example.test ",
      password: "VeryStrongPassw0rd!",
      confirmPassword: "VeryStrongPassw0rd!",
      acceptTerms: "on",
      acceptCharter: "on",
    }));

    expect(result).toEqual({
      ok: true,
      email: "hello@example.test",
      password: "VeryStrongPassw0rd!",
    });
  });

  it("rejects mismatched passwords", () => {
    const result = validateRegisterForm(formData({
      email: "hello@example.test",
      password: "VeryStrongPassw0rd!",
      confirmPassword: "AnotherStrongPassw0rd!",
      acceptTerms: "on",
      acceptCharter: "on",
    }));

    expect(result).toEqual({
      ok: false,
      error: "Les mots de passe ne correspondent pas.",
    });
  });

  it("rejects missing legal acceptances", () => {
    const result = validateRegisterForm(formData({
      email: "hello@example.test",
      password: "VeryStrongPassw0rd!",
      confirmPassword: "VeryStrongPassw0rd!",
      acceptTerms: "on",
    }));

    expect(result).toEqual({
      ok: false,
      error: "Vous devez accepter les CGU et la charte pour créer un compte.",
    });
  });
});
