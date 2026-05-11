import type { Route } from "next";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppShellFrame } from "@/design-system/organisms/AppShell";
import { Button } from "@/design-system/primitives/atoms/Button";

const storyNavigationItems: Array<{ href: Route; label: string }> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/billing", label: "Billing" },
  { href: "/media", label: "Media" },
  { href: "/account", label: "Compte" },
];

const meta = {
  title: "Design System/Organisms/AppShell",
  component: AppShellFrame,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppShellFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
    userEmail: "jane@example.test",
    locale: "fr",
    mercureStatus: "connected",
    navigationItems: storyNavigationItems,
    loginHref: "/login",
    logoutAction: "/api/auth/logout",
    localeToggleLabel: "Changer la langue en anglais",
    onToggleLocale: () => undefined,
    cookieBannerVisible: false,
    onAcceptCookies: () => undefined,
    onDeclineCookies: () => undefined,
    pwaBanner: null,
    children: (
      <div style={{ width: "min(var(--container), calc(100% - 2rem))", margin: "0 auto", padding: "2rem 0 4rem" }}>
        <Button>Primary call to action</Button>
      </div>
    ),
  },
};

export const WithCookieBanner: Story = {
  args: {
    ...Authenticated.args,
    isAuthenticated: false,
    userEmail: null,
    cookieBannerVisible: true,
  },
};
