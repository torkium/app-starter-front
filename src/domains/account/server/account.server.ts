import "server-only";

import { ServerService } from "@/infrastructure/api/ServerService";
import { getAccessToken } from "@/infrastructure/auth/serverAuth";
import type { LegalDocumentSummary, UserConsentSummary, UserSessionSummary } from "@/shared/types/account";

class AccountServerService extends ServerService {
  listLegalDocuments(locale?: string) {
    return this.serverGet<LegalDocumentSummary[]>("/legal-documents", undefined, locale ? { locale } : undefined);
  }

  listConsents(accessToken: string) {
    return this.serverGet<UserConsentSummary[]>("/account/consents", accessToken);
  }

  listSessions(accessToken: string) {
    return this.serverGet<UserSessionSummary[]>("/account/sessions", accessToken);
  }
}

const accountServerService = new AccountServerService();

export async function listLegalDocuments(locale?: string): Promise<LegalDocumentSummary[]> {
  return accountServerService.listLegalDocuments(locale);
}

export async function listConsents(): Promise<UserConsentSummary[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return [];
  }

  return accountServerService.listConsents(accessToken);
}

export async function listSessions(): Promise<UserSessionSummary[]> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return [];
  }

  return accountServerService.listSessions(accessToken);
}
