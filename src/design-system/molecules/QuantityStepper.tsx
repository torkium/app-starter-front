"use client";

import { useId } from "react";
import { Button } from "@/design-system/primitives/atoms/Button";

export type QuantityStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: React.ReactNode;
  unitLabel?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  label,
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  unit,
  unitLabel,
  disabled = false,
}: QuantityStepperProps) {
  const outputId = useId();
  const decrement = Math.max(min, value - step);
  const increment = Math.min(max, value + step);
  const accessibleUnit = unitLabel ?? (typeof unit === "string" || typeof unit === "number" ? String(unit) : "");
  const renderedValue = (
    <>
      {value}
      {unit ? <> {unit}</> : null}
    </>
  );
  const accessibleValue = `${value}${accessibleUnit ? ` ${accessibleUnit}` : ""}`;

  return (
    <div role="group" aria-label={label} aria-describedby={outputId} style={{ display: "inline-flex", alignItems: "center", gap: ".25rem", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", background: "var(--surface)", padding: ".2rem" }}>
      <Button
        type="button"
        tone="ghost"
        size="icon"
        aria-label={`Diminuer ${label}`}
        aria-describedby={outputId}
        disabled={disabled || value <= min}
        onClick={() => onChange(decrement)}
        style={{ minHeight: "2.75rem", minWidth: "2.75rem", width: "2.75rem" }}
      >
        -
      </Button>
      <output id={outputId} aria-live="polite" aria-label={`${label} actuel : ${accessibleValue}`} style={{ minWidth: "4.5rem", textAlign: "center", fontSize: ".84rem", fontVariantNumeric: "tabular-nums" }}>
        {renderedValue}
      </output>
      <Button
        type="button"
        tone="ghost"
        size="icon"
        aria-label={`Augmenter ${label}`}
        aria-describedby={outputId}
        disabled={disabled || value >= max}
        onClick={() => onChange(increment)}
        style={{ minHeight: "2.75rem", minWidth: "2.75rem", width: "2.75rem" }}
      >
        +
      </Button>
    </div>
  );
}
