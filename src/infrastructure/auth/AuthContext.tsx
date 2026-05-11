"use client";

import { createContext, useContext, useMemo } from "react";
import type { AuthenticatedUser } from "@/shared/types/auth";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthenticatedUser | null;
}) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: initialUser,
      isAuthenticated: initialUser !== null,
    }),
    [initialUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
