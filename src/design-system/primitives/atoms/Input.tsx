import { cn } from "@/shared/utils/cn";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = React.ComponentPropsWithRef<"input"> & {
  controlSize?: InputSize;
};

export function Input({ className, controlSize = "md", ref, ...props }: InputProps) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn("ui-input", "ui-field-control", className)}
      data-size={controlSize}
    />
  );
}
