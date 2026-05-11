"use client";

import { useEffect, useState } from "react";

export function usePwaInit() {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isInstalled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

    return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => setSwRegistration(registration))
      .catch((error: unknown) => console.error("[PWA] Service worker registration failed", error));
  }, []);

  return { swRegistration, isInstalled };
}
