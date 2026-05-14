import "server-only";
import { cookies } from "next/headers";
import { env, isProduction } from "@/infrastructure/env/env";
import { fetchJson } from "@/infrastructure/api/http";
import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from "@/infrastructure/auth/cookies";
import { ApiError } from "@/infrastructure/errors/apiError";
import type { AuthenticatedUser } from "@/shared/types/auth";
import { isJwtExpired } from "@/shared/utils/jwt";

interface AuthTokensResponse {
  access_token?: string;
  refresh_token?: string;
  session_id?: string;
  expires_in?: number;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface RequestEmailChangePayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface VerifyEmailPayload {
  token: string;
}

async function setSessionCookies(tokens: AuthTokensResponse): Promise<void> {
  const jar = await cookies();

  if (tokens.access_token) {
    jar.set(ACCESS_COOKIE, tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: tokens.expires_in ?? 60 * 60,
    });
  }

  if (tokens.refresh_token) {
    jar.set(REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  if (tokens.session_id) {
    jar.set(SESSION_COOKIE, tokens.session_id, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

async function getRefreshToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value;
}

async function refreshSessionInternal(): Promise<AuthTokensResponse | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const tokens = await fetchJson<AuthTokensResponse>(`${env.API_BASE_URL}${env.API_REFRESH_PATH}`, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    await setSessionCookies(tokens);
    return tokens;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      await clearSession();
      return null;
    }

    throw error;
  }
}

async function getStoredAccessToken(): Promise<string | undefined> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;

  if (accessToken && !isJwtExpired(accessToken)) {
    return accessToken;
  }

  return undefined;
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: isProduction, sameSite: "lax" });
  jar.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: isProduction, sameSite: "lax" });
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, secure: isProduction, sameSite: "lax" });
}

export async function loginWithCredentials(payload: LoginPayload): Promise<void> {
  const tokens = await fetchJson<AuthTokensResponse>(`${env.API_BASE_URL}${env.API_LOGIN_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await setSessionCookies(tokens);
}

export async function registerWithCredentials(payload: RegisterPayload): Promise<void> {
  await fetchJson(`${env.API_BASE_URL}${env.API_REGISTER_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<void> {
  await fetchJson(`${env.API_BASE_URL}${env.API_FORGOT_PASSWORD_PATH}`, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      resetUrl: `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=[token]`,
    }),
  });
}

export async function requestEmailChange(payload: RequestEmailChangePayload): Promise<void> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new ApiError("Session expired", 401);
  }

  await fetchJson(`${env.API_BASE_URL}/account/change-email/request`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await fetchJson(`${env.API_BASE_URL}${env.API_RESET_PASSWORD_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
  await fetchJson(`${env.API_BASE_URL}${env.API_VERIFY_EMAIL_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function confirmEmailChange(payload: VerifyEmailPayload): Promise<void> {
  await fetchJson(`${env.API_BASE_URL}${env.API_CONFIRM_EMAIL_CHANGE_PATH}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshSession(): Promise<boolean> {
  const tokens = await refreshSessionInternal();
  return Boolean(tokens?.access_token);
}

export async function getAccessToken(): Promise<string | undefined> {
  return getStoredAccessToken();
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const accessToken = await getStoredAccessToken();
  if (!accessToken) {
    return null;
  }

  try {
    return await fetchJson<AuthenticatedUser>(`${env.API_BASE_URL}${env.API_ME_PATH}`, {
      method: "GET",
      accessToken,
    });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}
