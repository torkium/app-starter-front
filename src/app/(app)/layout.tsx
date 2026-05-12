import { redirect } from "next/navigation";
import { AppShell } from "@/features/shell/AppShell";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
