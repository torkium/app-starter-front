"use client";

import { useEffect, useState } from "react";
import { Card } from "@/design-system/molecules/Card";
import { Field } from "@/design-system/molecules/Field";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
import { Section } from "@/design-system/organisms/Section";
import { useDirectUpload } from "@/domains/media/hooks/useDirectUpload";
import { mediaService } from "@/domains/media/services/media.service";
import { getSafeMediaUrl } from "@/infrastructure/media/protection";
import type { MediaAsset } from "@/shared/types/media";

export function MediaPageClient() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, uploadedAsset, progress, isUploading, error: uploadError } = useDirectUpload();

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const response = await mediaService.listAssets({ limit: 50 }).catch(() => ({
          items: [],
          pagination: { limit: 50, offset: 0, nextOffset: null, hasMore: false },
        }));
        if (cancelled) {
          return;
        }
        setAssets(response.items);
        setNextOffset(response.pagination.nextOffset);
        setLoading(false);
      } catch (cause) {
        if (cancelled) {
          return;
        }
        setError(cause instanceof Error ? cause.message : "Chargement media impossible");
        setLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFile) {
      setError("Sélectionnez un fichier avant l’upload");
      return;
    }

    setError(null);

    try {
      const asset = await upload(selectedFile);
      setAssets((current) => [asset, ...current.filter((existingAsset) => existingAsset.id !== asset.id)]);
      setSelectedFile(null);
    } catch {}
  }

  async function loadMore() {
    if (nextOffset === null) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const response = await mediaService.listAssets({ limit: 50, offset: nextOffset });
      setAssets((current) => {
        const seen = new Set(current.map((asset) => asset.id));
        return [...current, ...response.items.filter((asset) => !seen.has(asset.id))];
      });
      setNextOffset(response.pagination.nextOffset);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Chargement media impossible");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <Section
      eyebrow="Media"
      title="Upload direct sécurisé et médiathèque minimale."
      description="Le navigateur envoie le binaire directement vers le stockage objet, puis confirme l’upload auprès du backend via le proxy Next."
      titleAs="h1"
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        {error ? <Notice tone="warning">{error}</Notice> : null}
        {uploadError ? <Notice tone="warning">{uploadError}</Notice> : null}
        <Card title="Nouvel upload" description="Shell prêt pour S3, B2, R2 ou tout stockage compatible URL présignée.">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <Field label="Fichier" hint="La validation métier reste côté backend lors de la création de l’intent.">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </Field>
            {selectedFile ? (
              <Notice>
                {selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo · progression {progress}%
              </Notice>
            ) : null}
            <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Upload en cours..." : "Envoyer"}
              </Button>
              <span style={{ color: "var(--text-muted)" }}>
                {uploadedAsset ? `Dernier upload: ${uploadedAsset.filename}` : "Aucun upload confirmé sur cette session"}
              </span>
            </div>
          </form>
        </Card>

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {assets.length === 0 && !loading ? (
            <Card
              title="Médiathèque vide"
              description="Branchez la route de listing backend pour afficher les médias déjà connus du compte."
            />
          ) : null}
          {assets.map((asset) => {
            const previewUrl = getSafeMediaUrl(asset.previewUrl);

            return (
              <Card
                key={asset.id}
                title={asset.filename}
                description={`${asset.mimeType} · ${Math.round(asset.size / 1024)} Ko · ${asset.status}`}
              >
                {previewUrl ? (
                  <a href={previewUrl} target="_blank" rel="noreferrer" style={{ color: "var(--primary-strong)" }}>
                    Ouvrir le média
                  </a>
                ) : (
                  <span style={{ color: "var(--text-muted)" }}>Aucune URL de preview fiable exposée</span>
                )}
              </Card>
            );
          })}
        </div>
        {nextOffset !== null ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => void loadMore()} disabled={loadingMore}>
              {loadingMore ? "Chargement..." : "Charger plus"}
            </Button>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
