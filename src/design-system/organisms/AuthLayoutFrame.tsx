import Image from "next/image";

export type AuthLayoutFrameProps = {
  children: React.ReactNode;
  brandLabel: string;
  brandHref?: string;
  logoSrc: string;
  backgroundImageSrc: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};

export function AuthLayoutFrame({
  children,
  brandLabel,
  brandHref = "/",
  logoSrc,
  backgroundImageSrc,
  eyebrow,
  title,
  description,
}: AuthLayoutFrameProps) {
  return (
    <main className="ui-auth-layout">
      <div
        className="ui-auth-layout__background"
        style={{ backgroundImage: `url("${backgroundImageSrc}")` }}
        aria-hidden="true"
      />
      <div className="ui-auth-layout__shade" aria-hidden="true" />

      <section className="ui-auth-layout__content" aria-label={`Accès ${brandLabel}`}>
        <div className="ui-auth-layout__brand">
          <a href={brandHref} className="ui-auth-layout__logo" aria-label={brandLabel}>
            <Image src={logoSrc} alt="" width={44} height={44} priority />
            <span>{brandLabel}</span>
          </a>

          <div className="ui-auth-layout__pitch">
            {eyebrow ? <p className="ui-auth-layout__eyebrow">{eyebrow}</p> : null}
            <p className="ui-auth-layout__title">{title}</p>
            <p>{description}</p>
          </div>
        </div>

        <div className="ui-auth-layout__panel">{children}</div>
      </section>
    </main>
  );
}
