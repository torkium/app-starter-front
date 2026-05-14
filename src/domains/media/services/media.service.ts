"use client";

import { env } from "@/infrastructure/env/env";
import { ProxyService } from "@/infrastructure/api/ProxyService";
import type { ApiListEnvelope, PaginatedResponse, Pagination } from "@/shared/types/api";
import type { CompleteUploadInput, MediaAsset, UploadIntent, UploadIntentInput } from "@/shared/types/media";

type MediaAssetListResponse = PaginatedResponse<MediaAsset> | ApiListEnvelope<MediaAsset> | MediaAsset[];

function normalizePagination(response: MediaAssetListResponse): Pagination {
  if (!Array.isArray(response) && "pagination" in response && response.pagination) {
    const pagination = response.pagination;
    if ("limit" in pagination && "offset" in pagination) {
      return pagination;
    }

    return {
      limit: pagination.perPage,
      offset: Math.max(0, (pagination.page - 1) * pagination.perPage),
      nextOffset: pagination.page < (pagination.pageCount ?? pagination.page) ? pagination.page * pagination.perPage : null,
      hasMore: pagination.page < (pagination.pageCount ?? pagination.page),
    };
  }

  const itemCount = Array.isArray(response) ? response.length : "items" in response ? response.items.length : response.data.length;
  return {
    limit: itemCount,
    offset: 0,
    nextOffset: null,
    hasMore: false,
  };
}

function normalizeAssetListResponse(response: MediaAssetListResponse): PaginatedResponse<MediaAsset> {
  if (Array.isArray(response)) {
    return { items: response, pagination: normalizePagination(response) };
  }

  if ("items" in response) {
    return { items: response.items, pagination: normalizePagination(response) };
  }

  return { items: response.data, pagination: normalizePagination(response) };
}

class MediaService extends ProxyService {
  constructor() {
    super("");
  }

  async listAssets(query: { limit?: number; offset?: number } = {}) {
    const response = await this.get<MediaAssetListResponse>(env.API_MEDIA_LIBRARY_PATH, query, { unwrapData: false });
    return normalizeAssetListResponse(response);
  }

  createUploadIntent(payload: UploadIntentInput) {
    return this.post<UploadIntent, UploadIntentInput>(env.API_MEDIA_UPLOAD_PREPARE_PATH, payload);
  }

  completeUpload(payload: CompleteUploadInput) {
    return this.post<MediaAsset, CompleteUploadInput>(env.API_MEDIA_UPLOAD_COMPLETE_PATH, payload);
  }
}

export const mediaService = new MediaService();
