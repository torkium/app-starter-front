"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { env } from "@/infrastructure/env/env";
import { useAuth } from "@/infrastructure/auth/AuthContext";

interface MercureContextValue {
  status: "disabled" | "idle" | "connected" | "error";
}

const MercureContext = createContext<MercureContextValue | undefined>(undefined);

export function MercureProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  const mercureDisabled = env.NEXT_PUBLIC_MERCURE_DISABLED === "true" || !env.NEXT_PUBLIC_MERCURE_URL;
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connected" | "error">("idle");

  useEffect(() => {
    if (mercureDisabled || !isAuthenticated || !userId) {
      return;
    }

    let source: EventSource | undefined;
    let cancelled = false;

    async function connect(): Promise<void> {
      const authorizationResponse = await fetch("/api/proxy/account/realtime/authorize", {
        method: "POST",
        cache: "no-store",
      });

      if (!authorizationResponse.ok || cancelled) {
        setConnectionStatus("error");
        return;
      }

      const url = new URL(env.NEXT_PUBLIC_MERCURE_URL);
      url.searchParams.set("topic", `/users/${userId}`);

      source = new EventSource(url, { withCredentials: true });
      source.onopen = () => setConnectionStatus("connected");
      source.onerror = () => setConnectionStatus("error");
    }

    void connect();

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [isAuthenticated, mercureDisabled, userId]);

  const status = mercureDisabled ? "disabled" : !isAuthenticated || !userId ? "idle" : connectionStatus;
  const value = useMemo<MercureContextValue>(() => ({ status }), [status]);

  return <MercureContext.Provider value={value}>{children}</MercureContext.Provider>;
}

export function useMercure(): MercureContextValue {
  const context = useContext(MercureContext);
  if (!context) {
    throw new Error("useMercure doit être utilisé dans MercureProvider");
  }
  return context;
}
