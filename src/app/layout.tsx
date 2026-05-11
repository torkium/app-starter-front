import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/infrastructure/AppProviders";
import { AppShell } from "@/features/shell/AppShell";
import { getCurrentUser } from "@/infrastructure/auth/serverAuth";
import { getLocale } from "@/infrastructure/i18n/serverLocale";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "App Front",
  description: "Frontend Next.js SSR, auth, proxy API, realtime et design system neutre.",
  applicationName: "App Front",
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);

  return (
    <html lang={locale} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
        <AppProviders initialUser={user} initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
