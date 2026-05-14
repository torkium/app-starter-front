type AccessibleSwitchName =
  | { label: React.ReactNode; "aria-label"?: string; "aria-labelledby"?: string }
  | { label?: never; "aria-label": string; "aria-labelledby"?: string }
  | { label?: never; "aria-label"?: string; "aria-labelledby": string };

export type SwitchProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "aria-label" | "aria-labelledby"> & AccessibleSwitchName;

export function Switch({ label, ref, ...props }: SwitchProps) {
  return (
    <label className="ui-switch">
      <span className="ui-switch__control">
        <input {...props} ref={ref} type="checkbox" role="switch" />
        <span className="ui-switch__track" aria-hidden="true" />
        <span className="ui-switch__thumb" aria-hidden="true" />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
