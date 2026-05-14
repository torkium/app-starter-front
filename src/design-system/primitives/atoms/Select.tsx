import { cn } from "@/shared/utils/cn";

export type SelectSize = "sm" | "md" | "lg";

export type SelectProps = React.ComponentPropsWithRef<"select"> & {
  controlSize?: SelectSize;
};

export function Select({ className, controlSize = "md", children, ref, ...props }: SelectProps) {
  return (
    <select {...props} ref={ref} className={cn("ui-field-control", "ui-select", className)} data-size={controlSize}>
      {children}
    </select>
  );
}
