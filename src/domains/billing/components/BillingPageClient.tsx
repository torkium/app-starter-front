"use client";

import { useEffect, useState } from "react";
import { Card } from "@/design-system/molecules/Card";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Section } from "@/design-system/organisms/Section";
import { billingService } from "@/domains/billing/services/billing.service";
import type { BillingPlan, CurrentSubscription } from "@/shared/types/billing";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function BillingPageClient() {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const [planList, currentSubscription] = await Promise.all([
          billingService.listPlans().catch(() => []),
          billingService.getCurrentSubscription().catch(() => null),
        ]);

        if (cancelled) {
          return;
        }

        setPlans(planList);
        setSubscription(currentSubscription);
        setLoading(false);
      } catch (cause) {
        if (cancelled) {
          return;
        }
        setError(cause instanceof Error ? cause.message : "Chargement billing impossible");
        setLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  async function startCheckout(planCode: string) {
    setCheckoutPlan(planCode);
    setError(null);

    try {
      const result = await billingService.startCheckout({
        planCode,
        successUrl: `${window.location.origin}/billing?checkout=success`,
        cancelUrl: `${window.location.origin}/billing?checkout=cancel`,
      });

      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      throw new Error("Le backend n’a pas retourné d’URL de checkout");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Démarrage checkout impossible");
      setCheckoutPlan(null);
    }
  }

  return (
    <Section
      eyebrow="Billing"
      title="Facturation générique prête à brancher."
      description="Catalogue d’offres, abonnement courant et démarrage de checkout via le proxy Next, sans dépendance métier dating."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        {error ? <Notice tone="warning">{error}</Notice> : null}
        <Card
          title="Abonnement courant"
          description={
            loading
              ? "Chargement de l’état d’abonnement..."
              : subscription
                ? `${subscription.planName} · ${subscription.status}${subscription.renewsAt ? ` · renouvellement ${subscription.renewsAt}` : ""}`
                : "Aucun abonnement actif chargé depuis le backend."
          }
        />
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {plans.length === 0 && !loading ? (
            <Card
              title="Aucune offre"
              description="Exposez une liste de plans côté backend pour alimenter automatiquement ce shell."
            />
          ) : null}
          {plans.map((plan) => (
            <Card
              key={plan.code}
              title={plan.name}
              description={plan.description ?? `${formatPrice(plan.amount, plan.currency)} / ${plan.period}`}
              footer={
                <Button onClick={() => void startCheckout(plan.code)} disabled={checkoutPlan === plan.code}>
                  {checkoutPlan === plan.code ? "Redirection..." : "Choisir ce plan"}
                </Button>
              }
            >
              <p style={{ fontSize: "1.4rem", margin: ".75rem 0", fontWeight: 700 }}>
                {formatPrice(plan.amount, plan.currency)}
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--text-muted)" }}>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
