export type BillingPeriod = "month" | "quarter" | "semester" | "year" | "custom";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "inactive";

export interface BillingPlan {
  id: string;
  code: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  period: BillingPeriod;
  trialDays?: number;
  highlight?: boolean;
  features: string[];
}

export interface CurrentSubscription {
  id: string;
  status: SubscriptionStatus;
  planCode: string;
  planName: string;
  renewsAt?: string;
  cancelAtPeriodEnd?: boolean;
  amount?: number;
  currency?: string;
}

export interface CheckoutSessionPayload {
  planCode: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl?: string;
  clientSecret?: string;
  sessionId?: string;
}
