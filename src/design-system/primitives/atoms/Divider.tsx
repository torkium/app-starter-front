import { cn } from "@/shared/utils/cn";

export type DividerProps = React.HTMLAttributes<HTMLHRElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Divider({ orientation = "horizontal", className, ...props }: DividerProps) {
  return (
    <hr
      {...props}
      aria-orientation={orientation}
      className={cn("ui-divider", className)}
      data-orientation={orientation}
    />
  );
}
