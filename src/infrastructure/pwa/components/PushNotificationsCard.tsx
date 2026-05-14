"use client";

import { Card } from "@/design-system/molecules/Card";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { usePushNotifications } from "@/infrastructure/pwa/usePushNotifications";

export function PushNotificationsCard({
  registration,
  isInstalled,
}: {
  registration: ServiceWorkerRegistration | null;
  isInstalled: boolean;
}) {
  const { isSupported, permission, isSubscribed, isLoading, error, enable, disable } = usePushNotifications(
    registration,
    isInstalled,
  );
  const isIos = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  let description = "Connectez votre backend pour enregistrer la souscription web push de cet appareil.";

  if (!isSupported) {
    description = "Navigateur non compatible avec les notifications push web.";
  } else if (permission === "denied") {
    description = "Permission refusée. Réactivez-la dans le navigateur ou le système.";
  } else if (!isInstalled && isIos) {
    description = "Sur iOS, installez d’abord la PWA sur l’écran d’accueil pour activer le push.";
  } else if (isSubscribed) {
    description = "Souscription active sur cet appareil.";
  } else if (!registration) {
    description = "Service worker en cours d’initialisation.";
  }

  return (
    <Card
      title="Push notifications"
      description={description}
      footer={
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          {isSubscribed ? (
            <Button tone="secondary" onClick={() => void disable()} disabled={isLoading}>
              Désactiver
            </Button>
          ) : (
            <Button onClick={() => void enable()} disabled={isLoading || !isSupported || !registration}>
              Activer
            </Button>
          )}
          <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>
            {isLoading ? "Synchronisation..." : isSubscribed ? "Actif" : "Inactif"}
          </span>
        </div>
      }
    >
      {error ? <Notice tone="warning">{error}</Notice> : null}
    </Card>
  );
}
