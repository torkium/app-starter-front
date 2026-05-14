import { clearSession } from "@/infrastructure/auth/serverAuth";

export async function POST() {
  await clearSession();

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
    },
  });
}
