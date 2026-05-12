import { cloneElement, isValidElement, useId } from "react";

export function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: React.ReactElement;
}) {
  const fieldId = useId();
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const controlId = isValidElement<Record<string, unknown>>(children) && typeof children.props.id === "string"
    ? children.props.id
    : fieldId;

  let control = children;

  if (isValidElement<Record<string, unknown>>(children)) {
    const childProps = children.props as Record<string, unknown>;
    const describedBy = [childProps["aria-describedby"], hintId, errorId]
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .join(" ");

    control = cloneElement(children, {
      id: controlId,
      "aria-describedby": describedBy || undefined,
      "aria-errormessage": errorId,
      "aria-invalid": error ? true : childProps["aria-invalid"],
      required: required || childProps.required ? true : undefined,
    });
  }

  return (
    <div style={{ display: "grid", gap: ".45rem" }}>
      <label htmlFor={controlId} style={{ fontWeight: 600 }}>
        {label}
      </label>
      {control}
      {hint ? <span id={hintId} style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{hint}</span> : null}
      {error ? <span id={errorId} style={{ color: "var(--danger)", fontSize: ".92rem" }}>{error}</span> : null}
    </div>
  );
}
