import { NextResponse } from "next/server";
import { clearSession } from "@/infrastructure/auth/serverAuth";

export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/login", request.url), {
    status: 302,
  });
}
