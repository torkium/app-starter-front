import { cloneElement, isValidElement, useId } from "react";

export type FieldRenderProps = {
  id: string;
  labelId: string;
  describedBy?: string;
  errorId?: string;
  invalid?: boolean;
  required?: boolean;
};

type FieldProps = {
  label: React.ReactNode;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactElement | ((props: FieldRenderProps) => React.ReactNode);
  required?: boolean;
  optionalText?: string;
  labelHidden?: boolean;
  labelMode?: "control" | "group";
};

export function Field({
  label,
  error,
  hint,
  required,
  optionalText,
  labelHidden = false,
  labelMode,
  children,
}: FieldProps) {
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const controlId = isValidElement<Record<string, unknown>>(children) && typeof children.props.id === "string"
    ? children.props.id
    : fieldId;
  let resolvedControlId = controlId;

  const baseDescribedBy = [hintId, errorId].filter((value): value is string => typeof value === "string").join(" ");
  const resolvedLabelMode = labelMode ?? "control";
  let control: React.ReactNode = null;

  function decorateControlElement(element: React.ReactElement<Record<string, unknown>>) {
    const childProps = element.props;
    const childControlId = typeof childProps.id === "string" ? childProps.id : controlId;
    const describedBy = [childProps["aria-describedby"], baseDescribedBy]
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .join(" ");
    resolvedControlId = childControlId;

    return cloneElement(element, {
      id: childControlId,
      "aria-describedby": describedBy || undefined,
      "aria-errormessage": errorId || undefined,
      "aria-invalid": error ? true : childProps["aria-invalid"],
      required: required || childProps.required ? true : undefined,
    });
  }

  if (typeof children === "function") {
    const renderedControl = children({
      id: controlId,
      labelId,
      describedBy: baseDescribedBy || undefined,
      errorId,
      invalid: Boolean(error),
      required,
    });

    control = resolvedLabelMode === "group" ? (
      <div role="group" aria-labelledby={labelId} aria-describedby={baseDescribedBy || undefined}>
        {renderedControl}
      </div>
    ) : isValidElement<Record<string, unknown>>(renderedControl) ? decorateControlElement(renderedControl) : renderedControl;
  } else if (isValidElement<Record<string, unknown>>(children)) {
    control = decorateControlElement(children);
  }

  return (
    <div style={{ display: "grid", gap: ".45rem" }}>
      {resolvedLabelMode === "control" ? (
        <label
          id={labelId}
          htmlFor={resolvedControlId}
          className={labelHidden ? "sr-only" : undefined}
          style={labelHidden ? undefined : { display: "flex", justifyContent: "space-between", gap: "1rem", fontWeight: 600 }}
        >
          <FieldLabelContent label={label} required={required} optionalText={optionalText} />
        </label>
      ) : (
        <span
          id={labelId}
          className={labelHidden ? "sr-only" : undefined}
          style={labelHidden ? undefined : { display: "flex", justifyContent: "space-between", gap: "1rem", fontWeight: 600 }}
        >
          <FieldLabelContent label={label} required={required} optionalText={optionalText} />
        </span>
      )}
      {control}
      {hint ? <span id={hintId} style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{hint}</span> : null}
      {error ? <span id={errorId} role="alert" style={{ color: "var(--danger)", fontSize: ".92rem" }}>{error}</span> : null}
    </div>
  );
}

function FieldLabelContent({ label, required, optionalText }: Pick<FieldProps, "label" | "required" | "optionalText">) {
  return (
    <>
      <span>{label}</span>
      {!required && optionalText ? <span style={{ color: "var(--text-muted)", fontSize: ".86rem", fontWeight: 500 }}>{optionalText}</span> : null}
    </>
  );
}
