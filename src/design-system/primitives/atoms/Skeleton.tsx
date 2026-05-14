import { cn } from "@/shared/utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLSpanElement>;

export function Skeleton({ className, style, ...props }: SkeletonProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={cn("ui-skeleton", className)}
      style={{ minHeight: "1rem", ...style }}
    />
  );
}
