import { redirect } from "next/navigation";
import { DashboardOverview } from "@/domains/user/components/DashboardOverview";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  return <DashboardOverview user={user} />;
}
