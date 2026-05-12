"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";
import type { AuthActionState } from "@/domains/auth/actionState";
import { ApiError } from "@/infrastructure/errors/apiError";
import { clearSession, confirmEmailChange, getCurrentUser, loginWithCredentials, registerWithCredentials, requestEmailChange, requestPasswordReset, resetPassword, verifyEmail } from "@/infrastructure/auth/serverAuth";

const ALLOWED_REDIRECT_PREFIXES = ["/account", "/billing", "/dashboard", "/media"] as const;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRedirectTarget(target: string): Route {
  if (!target.startsWith("/") || target.startsWith("//")) {
    return "/dashboard" as Route;
  }

  try {
    const url = new URL(target, "https://app.local");
    const isAllowedDestination = ALLOWED_REDIRECT_PREFIXES.some(
      (path) => url.pathname === path || url.pathname.startsWith(`${path}/`),
    );

    if (isAllowedDestination) {
      return `${url.pathname}${url.search}${url.hash}` as Route;
    }
  } catch {
    return "/dashboard" as Route;
  }

  return "/dashboard" as Route;
}

function toAuthActionState(error: unknown): AuthActionState {
  if (error instanceof ApiError) {
    return {
      error: error.message,
      requestId: error.requestId ?? null,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      requestId: null,
    };
  }

  return {
    error: "Une erreur inattendue est survenue.",
    requestId: null,
  };
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await loginWithCredentials({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect(normalizeRedirectTarget(getString(formData, "redirect")));
}

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await registerWithCredentials({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      firstName: getString(formData, "firstName"),
      lastName: getString(formData, "lastName"),
      acceptTerms: true,
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect("/register/success");
}

export async function forgotPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await requestPasswordReset({
      email: getString(formData, "email"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect("/forgot-password/success");
}

export async function resetPasswordAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await resetPassword({
      token: getString(formData, "token"),
      password: getString(formData, "password"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect("/login?reset=success");
}

export async function verifyEmailAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await verifyEmail({
      token: getString(formData, "token"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect("/verify-email/success");
}

export async function confirmEmailChangeAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const user = await getCurrentUser();

  try {
    await confirmEmailChange({
      token: getString(formData, "token"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect(user ? "/account?emailChanged=success" : "/login?emailChanged=success");
}

export async function requestEmailChangeAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  try {
    await requestEmailChange({
      email: getString(formData, "email"),
    });
  } catch (error) {
    return toAuthActionState(error);
  }

  redirect("/account?emailChangeRequested=success");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
