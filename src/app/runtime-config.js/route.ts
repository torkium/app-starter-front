import { NextResponse } from "next/server";
import { env } from "@/infrastructure/env/env";

function serializePublicConfig(config: Record<string, string>): string {
  return JSON.stringify(config).replace(/</g, "\\u003c");
}

export async function GET() {
  const publicConfig = {
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MERCURE_URL: env.NEXT_PUBLIC_MERCURE_URL,
    NEXT_PUBLIC_MERCURE_DISABLED: env.NEXT_PUBLIC_MERCURE_DISABLED,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MEDIA_BASE_URL: env.NEXT_PUBLIC_MEDIA_BASE_URL,
    NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL: env.NEXT_PUBLIC_MEDIA_UPLOAD_BASE_URL,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  };

  return new NextResponse(`window.__MY_APP_PUBLIC_CONFIG__ = ${serializePublicConfig(publicConfig)};`, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
