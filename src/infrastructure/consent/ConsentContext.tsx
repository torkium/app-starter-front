"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { readConsent, writeConsent, type ConsentChoice } from "@/infrastructure/consent/consent";

interface ConsentContextValue {
  consent: ConsentChoice | null;
  hydrated: boolean;
  setConsent: (choice: ConsentChoice) => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);
const listeners = new Set<() => void>();
let currentConsent: ConsentChoice | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getConsentSnapshot(): ConsentChoice | null {
  return currentConsent;
}

function getConsentServerSnapshot(): ConsentChoice | null {
  return null;
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getHydratedServerSnapshot(): boolean {
  return false;
}

if (typeof window !== "undefined") {
  currentConsent = readConsent();
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, getConsentSnapshot, getConsentServerSnapshot);
  const hydrated = useSyncExternalStore(subscribe, getHydratedSnapshot, getHydratedServerSnapshot);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      hydrated,
      setConsent: (choice) => {
        writeConsent(choice);
        currentConsent = choice;
        notify();
      },
    }),
    [consent, hydrated],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent doit être utilisé dans ConsentProvider");
  }
  return context;
}
