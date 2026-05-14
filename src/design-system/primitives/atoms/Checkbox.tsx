import { cn } from "@/shared/utils/cn";

type AccessibleCheckboxName =
  | { label: React.ReactNode; "aria-label"?: string; "aria-labelledby"?: string }
  | { label?: never; "aria-label": string; "aria-labelledby"?: string }
  | { label?: never; "aria-label"?: string; "aria-labelledby": string };

export type CheckboxProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "aria-label" | "aria-labelledby"> & AccessibleCheckboxName;

export function Checkbox({ label, className, ref, ...props }: CheckboxProps) {
  const input = <input {...props} ref={ref} type="checkbox" className={cn("ui-checkbox", className)} />;

  if (!label) {
    return input;
  }

  return (
    <label className="ui-check">
      {input}
      <span>{label}</span>
    </label>
  );
}
