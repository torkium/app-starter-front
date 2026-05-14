import { cn } from "@/shared/utils/cn";

export type TextareaSize = "sm" | "md" | "lg";

export type TextareaProps = React.ComponentPropsWithRef<"textarea"> & {
  controlSize?: TextareaSize;
};

export function Textarea({ className, controlSize = "md", ref, ...props }: TextareaProps) {
  return <textarea {...props} ref={ref} className={cn("ui-field-control", "ui-textarea", className)} data-size={controlSize} />;
}
