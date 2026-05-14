import { AuthLayoutFrame } from "@/design-system/organisms/AuthLayoutFrame";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayoutFrame
      brandLabel="My App"
      logoSrc="/brand/app-mark.svg"
      backgroundImageSrc="/images/auth-background.png"
      eyebrow="Espace applicatif"
      title="Avancez avec un socle clair."
      description="Suivez votre activité et vos contenus dans un espace clair, calme et pensé pour durer."
    >
      {children}
    </AuthLayoutFrame>
  );
}
