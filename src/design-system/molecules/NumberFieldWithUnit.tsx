import { useId } from "react";
import { Input, type InputProps } from "@/design-system/primitives/atoms/Input";

export type NumberFieldWithUnitProps = Omit<InputProps, "type"> & {
  label: React.ReactNode;
  unit: React.ReactNode;
  unitLabel?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
};

export function NumberFieldWithUnit({ label, unit, unitLabel, hint, error, id, style, ...props }: NumberFieldWithUnitProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const unitId = `${inputId}-unit`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const accessibleUnit = unitLabel ?? (typeof unit === "string" || typeof unit === "number" ? String(unit) : undefined);
  const describedBy = [props["aria-describedby"], accessibleUnit ? unitId : undefined, hintId, errorId]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  return (
    <div style={{ display: "grid", gap: ".45rem" }}>
      <label htmlFor={inputId} style={{ fontWeight: 600 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <Input
          {...props}
          id={inputId}
          type="number"
          aria-describedby={describedBy || undefined}
          aria-errormessage={errorId}
          aria-invalid={error ? true : props["aria-invalid"]}
          style={{ paddingRight: "3.25rem", ...style }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: ".9rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            fontSize: ".86rem",
            pointerEvents: "none",
          }}
        >
          {unit}
        </span>
      </div>
      {accessibleUnit ? <span id={unitId} className="sr-only">Unité : {accessibleUnit}</span> : null}
      {hint ? <span id={hintId} style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{hint}</span> : null}
      {error ? <span id={errorId} role="alert" style={{ color: "var(--danger)", fontSize: ".92rem" }}>{error}</span> : null}
    </div>
  );
}
