"use client";

import { useRef } from "react";

export type ChoiceGroupOption = {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type ChoiceGroupProps = {
  label: string;
  options: ChoiceGroupOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  columns?: "auto" | 1 | 2 | 3;
};

export function ChoiceGroup({ label, options, value, onChange, name, columns = "auto" }: ChoiceGroupProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedEnabledIndex = options.findIndex((option) => option.value === value && !option.disabled);
  const selectedEnabledOption = selectedEnabledIndex >= 0 ? options[selectedEnabledIndex] : undefined;
  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  const focusableIndex = selectedEnabledIndex >= 0 ? selectedEnabledIndex : firstEnabledIndex;
  const gridTemplateColumns = columns === "auto"
    ? "repeat(auto-fit, minmax(12rem, 1fr))"
    : `repeat(${columns}, minmax(0, 1fr))`;

  function selectByIndex(index: number) {
    const option = options[index];
    if (!option || option.disabled) {
      return;
    }

    onChange(option.value);
    optionRefs.current[index]?.focus();
  }

  function moveSelection(currentIndex: number, direction: 1 | -1) {
    const enabledIndexes = options
      .map((option, index) => option.disabled ? -1 : index)
      .filter((index) => index >= 0);
    if (enabledIndexes.length === 0) {
      return;
    }

    const enabledPosition = enabledIndexes.indexOf(currentIndex);
    const nextPosition = enabledPosition >= 0
      ? (enabledPosition + direction + enabledIndexes.length) % enabledIndexes.length
      : 0;

    const nextIndex = enabledIndexes[nextPosition];
    if (nextIndex !== undefined) {
      selectByIndex(nextIndex);
    }
  }

  return (
    <div role="radiogroup" aria-label={label} style={{ display: "grid", gridTemplateColumns, gap: ".75rem" }}>
      {name && selectedEnabledOption ? <input type="hidden" name={name} value={selectedEnabledOption.value} /> : null}
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabIndex={!option.disabled && index === focusableIndex ? 0 : -1}
            className="ui-focus-ring"
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (["ArrowRight", "ArrowDown"].includes(event.key)) {
                event.preventDefault();
                moveSelection(index, 1);
                return;
              }

              if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
                event.preventDefault();
                moveSelection(index, -1);
                return;
              }

              if (event.key === "Home") {
                event.preventDefault();
                selectByIndex(options.findIndex((item) => !item.disabled));
                return;
              }

              if (event.key === "End") {
                event.preventDefault();
                selectByIndex(options.map((item, itemIndex) => item.disabled ? -1 : itemIndex).filter((itemIndex) => itemIndex >= 0).at(-1) ?? -1);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              minWidth: 0,
              border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
              borderRadius: "var(--radius-md)",
              background: selected ? "var(--primary-soft)" : "var(--surface)",
              color: "var(--text)",
              cursor: option.disabled ? "not-allowed" : "pointer",
              opacity: option.disabled ? 0.58 : undefined,
              padding: "1rem",
              textAlign: "left",
              boxShadow: selected ? "0 0 0 1px var(--primary-soft)" : undefined,
            }}
          >
            <span style={{ display: "flex", alignItems: "start", gap: ".75rem", minWidth: 0 }}>
              {option.icon ? <span aria-hidden="true" style={{ color: selected ? "var(--primary-strong)" : "var(--text-muted)", flex: "0 0 auto" }}>{option.icon}</span> : null}
              <span style={{ display: "grid", gap: ".2rem", minWidth: 0 }}>
                <span style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{option.title}</span>
                {option.description ? <span style={{ color: "var(--text-muted)", fontSize: ".86rem", lineHeight: 1.4, overflowWrap: "anywhere" }}>{option.description}</span> : null}
              </span>
            </span>
            <span
              aria-hidden="true"
              style={{
                width: "1rem",
                height: "1rem",
                flex: "0 0 auto",
                border: `2px solid ${selected ? "var(--primary)" : "var(--border-strong)"}`,
                borderRadius: "var(--radius-pill)",
                background: selected ? "radial-gradient(circle, var(--primary) 42%, transparent 46%)" : "transparent",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
