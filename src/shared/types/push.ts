export interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
}

export interface PushSubscriptionState {
  subscribed: boolean;
  endpoint?: string;
  updatedAt?: string;
}
