"use client";

import { useState } from "react";
import { mediaService } from "@/domains/media/services/media.service";
import { env } from "@/infrastructure/env/env";
import { sha256HexFromFile } from "@/shared/crypto/sha256";
import type { MediaAsset } from "@/shared/types/media";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedAsset: MediaAsset | null;
}

async function computeSha256(file: File): Promise<string> {
  return sha256HexFromFile(file);
}

async function uploadBinary(
  uploadUrl: string,
  file: File,
  headers: Record<string, string> = {},
  fields: Record<string, string> = {},
  method = "PUT",
) {
  const resolvedUploadUrl = resolveUploadUrl(uploadUrl);
  const normalizedMethod = method.toUpperCase();
  const body = normalizedMethod === "POST" ? buildMultipartBody(file, fields) : file;
  const response = await fetch(resolvedUploadUrl, {
    method: normalizedMethod,
    body,
    headers: body instanceof FormData ? undefined : headers,
  });

  if (!response.ok) {
    throw new Error("Transfert binaire refusé par le stockage");
  }
}

function buildMultipartBody(file: File, fields: Record<string, string>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  formData.set("file", file);

  return formData;
}

function resolveUploadUrl(uploadUrl: string): string {
  if (/^https?:\/\//i.test(uploadUrl)) {
    assertAllowedUploadOrigin(uploadUrl);

    return uploadUrl;
  }

  if (uploadUrl.startsWith("/api/")) {
    return `/api/proxy${uploadUrl.slice("/api".length)}`;
  }

  if (uploadUrl.startsWith("/")) {
    return `/api/proxy${uploadUrl}`;
  }

  return `/api/proxy/${uploadUrl.replace(/^\/+/, "")}`;
}

function assertAllowedUploadOrigin(uploadUrl: string): void {
  const allowedBaseUrl = env.NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL;
  if (!allowedBaseUrl) {
    return;
  }

  const allowedOrigin = new URL(allowedBaseUrl).origin;
  const uploadOrigin = new URL(uploadUrl).origin;

  if (allowedOrigin !== uploadOrigin) {
    throw new Error("Origine d'upload refusée par la configuration My App");
  }
}

export function useDirectUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedAsset: null,
  });

  async function upload(file: File) {
    setState({ isUploading: true, progress: 5, error: null, uploadedAsset: null });

    try {
      const intent = await mediaService.createUploadIntent({
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        purpose: "library",
      });

      setState((current) => ({ ...current, progress: 30 }));
      await uploadBinary(
        intent.upload.uploadUrl,
        file,
        intent.upload.headers,
        intent.upload.fields,
        intent.upload.method ?? "PUT",
      );
      setState((current) => ({ ...current, progress: 80 }));
      const checksum = await computeSha256(file);

      const uploadedAsset = await mediaService.completeUpload({
        assetId: intent.asset.id,
        checksum,
      });

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        uploadedAsset,
      });

      return uploadedAsset;
    } catch (error) {
      setState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload impossible",
        uploadedAsset: null,
      });
      throw error;
    }
  }

  return { ...state, upload };
}
