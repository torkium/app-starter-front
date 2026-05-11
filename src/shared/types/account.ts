export interface LegalDocumentSummary {
  id: string;
  code: string;
  version: string;
  locale: string;
  title: string;
  content: string;
  publishedAt: string;
}

export interface UserConsentSummary {
  code: string;
  version: string;
  title: string;
  acceptedAt: string;
}

export interface UserSessionSummary {
  id: string;
  deviceName?: string | undefined;
  createdAt: string;
  lastUsedAt?: string | undefined;
  lastUsedIp?: string | undefined;
  lastUsedUserAgent?: string | undefined;
  expiresAt: string;
  revokedAt?: string | undefined;
  revokedReason?: string | undefined;
  isCurrent: boolean;
}
