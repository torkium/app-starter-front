"use client";

import { env } from "@/infrastructure/env/env";
import { ProxyService } from "@/infrastructure/api/ProxyService";
import type { PaginatedResponse } from "@/shared/types/api";
import type { BillingHistoryEvent, BillingPlan, CheckoutSessionPayload, CheckoutSessionResult, CurrentSubscription } from "@/shared/types/billing";

class BillingService extends ProxyService {
  constructor() {
    super("");
  }

  listPlans() {
    return this.get<BillingPlan[]>(env.API_BILLING_PLANS_PATH);
  }

  getCurrentSubscription() {
    return this.get<CurrentSubscription | null>(env.API_BILLING_SUBSCRIPTION_PATH);
  }

  listHistory(query: { limit?: number; offset?: number } = {}) {
    return this.get<PaginatedResponse<BillingHistoryEvent>>(env.API_BILLING_HISTORY_PATH, query);
  }

  startCheckout(payload: CheckoutSessionPayload) {
    return this.post<CheckoutSessionResult, CheckoutSessionPayload>(env.API_BILLING_CHECKOUT_PATH, payload);
  }
}

export const billingService = new BillingService();
