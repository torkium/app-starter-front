"use client";

export type SegmentedControlOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  label: string;
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  compact?: boolean;
};

export function SegmentedControl({ label, options, value, onChange, name, compact = false }: SegmentedControlProps) {
  const selectedEnabledOption = options.find((option) => option.value === value && !option.disabled);

  return (
    <div role="group" aria-label={label} style={{ display: "inline-flex", maxWidth: "100%", gap: ".25rem", flexWrap: "wrap", border: "1px solid var(--border)", borderRadius: "var(--radius-pill)", background: "var(--surface)", padding: ".25rem" }}>
      {name && selectedEnabledOption ? <input type="hidden" name={name} value={selectedEnabledOption.value} /> : null}
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className="ui-focus-ring"
            style={{
              border: "1px solid transparent",
              borderRadius: "var(--radius-pill)",
              background: selected ? "var(--surface-contrast)" : "transparent",
              color: selected ? "var(--text-inverse)" : "var(--text)",
              padding: compact ? ".45rem .75rem" : ".6rem 1rem",
              fontSize: compact ? ".82rem" : ".9rem",
              fontWeight: 700,
              overflowWrap: "anywhere",
              cursor: option.disabled ? "not-allowed" : "pointer",
              opacity: option.disabled ? 0.5 : undefined,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
