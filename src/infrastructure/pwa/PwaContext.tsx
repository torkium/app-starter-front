"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
const PWA_DISMISSED_STORAGE_KEY = "starter:pwa-install-dismissed";
const PWA_DISMISSED_CHANGED_EVENT = "starter:pwa-install-dismissed-changed";

function getDismissedSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(PWA_DISMISSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeToDismissedChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PWA_DISMISSED_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PWA_DISMISSED_CHANGED_EVENT, onStoreChange);
  };
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const { swRegistration, isInstalled } = usePwaInit();
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const dismissed = useSyncExternalStore(subscribeToDismissedChanges, getDismissedSnapshot, () => false);

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
      dismissPrompt: () => {
        try {
          window.localStorage.setItem(PWA_DISMISSED_STORAGE_KEY, "1");
        } catch {
          // Some browsers or privacy modes can block localStorage; keep the app usable.
        }
        window.dispatchEvent(new Event(PWA_DISMISSED_CHANGED_EVENT));
      },
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
