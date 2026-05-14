import { cn } from "@/shared/utils/cn";

export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "accent";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span {...props} className={cn("ui-badge", className)} data-tone={tone} />;
}
