"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePwaInit } from "@/infrastructure/pwa/usePwaInit";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaContextValue {
  canInstall: boolean;
  isInstalled: boolean;
  swRegistration: ServiceWorkerRegistration | null;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
  dismissed: boolean;
}

const PwaContext = createContext<PwaContextValue | undefined>(undefined);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const { swRegistration, isInstalled } = usePwaInit();
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    void swRegistration;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, [swRegistration]);

  const promptInstall = useCallback(async () => {
    if (!deferredPromptRef.current) {
      return;
    }
    await deferredPromptRef.current.prompt();
    deferredPromptRef.current = null;
    setCanInstall(false);
  }, []);

  const value = useMemo<PwaContextValue>(
      () => ({
        canInstall,
        isInstalled,
        swRegistration,
        dismissed,
        promptInstall,
        dismissPrompt: () => setDismissed(true),
      }),
    [canInstall, dismissed, isInstalled, promptInstall, swRegistration],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa(): PwaContextValue {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa doit être utilisé dans PwaProvider");
  }
  return context;
}
