import { BaseService } from "@/infrastructure/api/BaseService";
import { env } from "@/infrastructure/env/env";
import type { QueryParams } from "@/shared/types/api";

export abstract class ServerService extends BaseService {
  constructor(basePath = env.API_BASE_URL) {
    super(basePath);
  }

  protected serverGet<T>(path: string, accessToken?: string, query?: QueryParams): Promise<T> {
    return this.get<T>(path, query, accessToken ? { accessToken } : undefined);
  }

  protected serverPost<T, K = unknown>(path: string, body?: K, accessToken?: string): Promise<T> {
    return this.post<T, K>(path, body, accessToken ? { accessToken } : undefined);
  }

  protected serverPut<T, K = unknown>(path: string, body?: K, accessToken?: string): Promise<T> {
    return this.put<T, K>(path, body, accessToken ? { accessToken } : undefined);
  }

  protected serverPatch<T, K = unknown>(path: string, body?: K, accessToken?: string): Promise<T> {
    return this.patch<T, K>(path, body, accessToken ? { accessToken } : undefined);
  }

  protected serverDelete<T>(path: string, accessToken?: string): Promise<T> {
    return this.delete<T>(path, accessToken ? { accessToken } : undefined);
  }
}
