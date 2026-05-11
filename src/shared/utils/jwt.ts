import type { AuthenticatedUser } from "@/shared/types/auth";

function decodeBase64Url(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export function readJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token) {
    return null;
  }

  const payload = token.split(".")[1];
  if (!payload) {
    return null;
  }

  const decoded = decodeBase64Url(payload);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isJwtExpired(token?: string, now = Date.now(), leewaySeconds = 30): boolean {
  const payload = readJwtPayload(token);
  if (!payload) {
    return true;
  }

  const exp = payload.exp;
  if (typeof exp !== "number") {
    return false;
  }

  return exp * 1000 <= now + leewaySeconds * 1000;
}

export function readUserFromJwt(token?: string): AuthenticatedUser | null {
  const parsed = readJwtPayload(token);
  if (!parsed) {
    return null;
  }

  try {
    const email = typeof parsed.email === "string" ? parsed.email : null;
    const id = typeof parsed.sub === "string" ? parsed.sub : email;
    if (!email || !id) {
      return null;
    }

    return {
      id,
      email,
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : undefined,
      lastName: typeof parsed.lastName === "string" ? parsed.lastName : undefined,
      emailVerified: Boolean(parsed.emailVerified ?? parsed.email_verified),
      roles: Array.isArray(parsed.roles) ? parsed.roles.filter((role): role is string => typeof role === "string") : [],
    };
  } catch {
    return null;
  }
}
