"use client";

import { env } from "@/infrastructure/env/env";
import { ProxyService } from "@/infrastructure/api/ProxyService";
import type { PushSubscriptionPayload, PushSubscriptionState } from "@/shared/types/push";

class PushService extends ProxyService {
  constructor() {
    super("");
  }

  getState() {
    return this.get<PushSubscriptionState | null>(env.API_PUSH_SUBSCRIPTIONS_PATH);
  }

  subscribe(payload: PushSubscriptionPayload) {
    return this.post<PushSubscriptionState, PushSubscriptionPayload>(env.API_PUSH_SUBSCRIPTIONS_PATH, payload);
  }

  unsubscribe(endpoint?: string) {
    return this.delete<PushSubscriptionState | null>(
      endpoint ? `${env.API_PUSH_SUBSCRIPTIONS_PATH}?endpoint=${encodeURIComponent(endpoint)}` : env.API_PUSH_SUBSCRIPTIONS_PATH,
    );
  }
}

export const pushService = new PushService();
