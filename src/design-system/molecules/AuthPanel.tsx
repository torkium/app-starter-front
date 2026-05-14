import { cn } from "@/shared/utils/cn";

export type AuthPanelProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthPanel({ title, description, children, footer, className }: AuthPanelProps) {
  return (
    <article className={cn("ui-auth-panel", className)}>
      <header className="ui-auth-panel__header">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>

      <div className="ui-auth-panel__body">{children}</div>

      {footer ? <footer className="ui-auth-panel__footer">{footer}</footer> : null}
    </article>
  );
}
