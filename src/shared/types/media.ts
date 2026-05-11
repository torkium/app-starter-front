export type MediaAssetStatus = "pending" | "uploaded" | "processing" | "ready" | "failed";

export interface UploadIntentInput {
  filename: string;
  mimeType: string;
  size: number;
  purpose?: string;
}

export interface DirectUploadTarget {
  uploadUrl: string;
  method?: "PUT" | "POST";
  headers?: Record<string, string>;
  fields?: Record<string, string>;
  expiresAt?: string;
  maxSizeBytes?: number;
}

export interface MediaAsset {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  status: MediaAssetStatus;
  previewUrl?: string;
  createdAt?: string;
}

export interface UploadIntent {
  asset: MediaAsset;
  upload: DirectUploadTarget;
}

export interface CompleteUploadInput {
  assetId: string;
  checksum: string;
  metadata?: Record<string, string>;
}
