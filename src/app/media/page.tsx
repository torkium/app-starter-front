import { redirect } from "next/navigation";
import { MediaOverview } from "@/domains/media/components/MediaOverview";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/media");
  }

  return <MediaOverview />;
}
