"use client";

import { useEffect, useState } from "react";
import { pushService } from "@/infrastructure/pwa/push.service";
import { env } from "@/infrastructure/env/env";
import type { PushSubscriptionPayload, PushSubscriptionState } from "@/shared/types/push";

function base64UrlToArrayBuffer(value: string): ArrayBuffer {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const normalized = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes.buffer;
}

function subscriptionToPayload(subscription: PushSubscription): PushSubscriptionPayload {
  const json = subscription.toJSON();
  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: {
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    },
  };
}

export function usePushNotifications(registration: ServiceWorkerRegistration | null, isInstalled: boolean) {
  const [state, setState] = useState<{
    isSupported: boolean;
    permission: NotificationPermission | "unsupported";
    isSubscribed: boolean;
    isLoading: boolean;
    error: string | null;
    serverState: PushSubscriptionState | null;
  }>({
    isSupported: false,
    permission: "unsupported",
    isSubscribed: false,
    isLoading: true,
    error: null,
    serverState: null,
  });

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    if (!isSupported) {
      setState({
        isSupported: false,
        permission: "unsupported",
        isSubscribed: false,
        isLoading: false,
        error: null,
        serverState: null,
      });
      return;
    }

    let cancelled = false;

    async function hydrate() {
      try {
        const [serverState, subscription] = await Promise.all([
          pushService.getState().catch(() => null),
          registration?.pushManager.getSubscription() ?? Promise.resolve(null),
        ]);

        if (cancelled) {
          return;
        }

        setState({
          isSupported: true,
          permission: Notification.permission,
          isSubscribed: Boolean(subscription),
          isLoading: false,
          error: null,
          serverState,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          isSupported: true,
          permission: Notification.permission,
          isSubscribed: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Initialisation push impossible",
          serverState: null,
        });
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [registration]);

  async function enable() {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      if (!registration) {
        throw new Error("Service worker indisponible");
      }

      if (!env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY manquante");
      }

      if (!isInstalled && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        throw new Error("Sur iOS, installez la PWA avant d’activer le push");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permission navigateur refusée");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToArrayBuffer(env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      const serverState = await pushService.subscribe(subscriptionToPayload(subscription));
      setState({
        isSupported: true,
        permission,
        isSubscribed: true,
        isLoading: false,
        error: null,
        serverState,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: error instanceof Error ? error.message : "Activation push impossible",
      }));
      throw error;
    }
  }

  async function disable() {
    if (!registration) {
      return;
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await pushService.unsubscribe(subscription.endpoint).catch(() => null);
        await subscription.unsubscribe();
      }

      setState((current) => ({
        ...current,
        isSubscribed: false,
        isLoading: false,
        serverState: null,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        isLoading: false,
        error: error instanceof Error ? error.message : "Désactivation push impossible",
      }));
      throw error;
    }
  }

  return {
    ...state,
    enable,
    disable,
  };
}
