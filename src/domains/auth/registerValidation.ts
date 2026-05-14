export type RegisterValidationResult =
  | { ok: true; email: string; password: string }
  | { ok: false; error: string };

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function validateRegisterForm(formData: FormData): RegisterValidationResult {
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (password !== confirmPassword) {
    return {
      ok: false,
      error: "Les mots de passe ne correspondent pas.",
    };
  }

  if (formData.get("acceptTerms") !== "on" || formData.get("acceptCharter") !== "on") {
    return {
      ok: false,
      error: "Vous devez accepter les CGU et la charte pour créer un compte.",
    };
  }

  return {
    ok: true,
    email: getString(formData, "email"),
    password,
  };
}
