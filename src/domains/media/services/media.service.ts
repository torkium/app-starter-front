"use client";

import { env } from "@/infrastructure/env/env";
import { ProxyService } from "@/infrastructure/api/ProxyService";
import type { CompleteUploadInput, MediaAsset, UploadIntent, UploadIntentInput } from "@/shared/types/media";

class MediaService extends ProxyService {
  constructor() {
    super("");
  }

  listAssets() {
    return this.get<MediaAsset[]>(env.API_MEDIA_LIBRARY_PATH);
  }

  createUploadIntent(payload: UploadIntentInput) {
    return this.post<UploadIntent, UploadIntentInput>(env.API_MEDIA_UPLOAD_PREPARE_PATH, payload);
  }

  completeUpload(payload: CompleteUploadInput) {
    return this.post<MediaAsset, CompleteUploadInput>(env.API_MEDIA_UPLOAD_COMPLETE_PATH, payload);
  }
}

export const mediaService = new MediaService();
