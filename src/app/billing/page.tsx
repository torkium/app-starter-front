import { redirect } from "next/navigation";
import { BillingOverview } from "@/domains/billing/components/BillingOverview";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/billing");
  }

  return <BillingOverview />;
}
