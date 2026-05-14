import { cn } from "@/shared/utils/cn";

export type SliderProps = Omit<React.ComponentPropsWithRef<"input">, "type">;

export function Slider({ className, min = 0, max = 100, step = 1, ref, ...props }: SliderProps) {
  return (
    <input
      {...props}
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      className={cn("ui-slider", className)}
    />
  );
}
