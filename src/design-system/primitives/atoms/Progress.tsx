import { cn } from "@/shared/utils/cn";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
  max?: number;
};

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(safeMax, Math.max(0, value));
  const percent = (clampedValue / safeMax) * 100;

  return (
    <div
      {...props}
      aria-valuemax={safeMax}
      aria-valuemin={0}
      aria-valuenow={Math.round(clampedValue)}
      className={cn("ui-progress", className)}
      role="progressbar"
    >
      <div className="ui-progress__bar" style={{ width: `${percent}%` }} />
    </div>
  );
}
