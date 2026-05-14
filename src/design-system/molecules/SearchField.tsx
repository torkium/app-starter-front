"use client";

import { useRef, useState } from "react";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";

export type InputGroupProps = {
  children: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  leadingWidth?: string;
  trailingWidth?: string;
};

type SearchFieldBaseProps = Omit<React.ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "onChange"> & {
  label: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  leading?: React.ReactNode;
};

type ControlledSearchFieldProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: never;
};

type UncontrolledSearchFieldProps = {
  value?: never;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
};

export type SearchFieldProps = SearchFieldBaseProps & (
  | ControlledSearchFieldProps
  | UncontrolledSearchFieldProps
);

export function InputGroup({ children, leading, trailing, leadingWidth = "2.5rem", trailingWidth = "2.5rem" }: InputGroupProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {leading ? (
        <div
          style={{
            position: "absolute",
            left: ".2rem",
            top: "50%",
            width: leadingWidth,
            display: "grid",
            placeItems: "center",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            pointerEvents: "none",
          }}
        >
          {leading}
        </div>
      ) : null}
      {children}
      {trailing ? (
        <div
          style={{
            position: "absolute",
            right: ".2rem",
            top: "50%",
            width: trailingWidth,
            display: "grid",
            placeItems: "center",
            transform: "translateY(-50%)",
          }}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

export function SearchField({ label, value, defaultValue, onClear, onValueChange, leading, style, ...props }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const canClear = !props.disabled && !props.readOnly;
  const showClear = Boolean(onClear && hasValue && canClear);

  function emitInputValue(nextValue: string) {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    valueSetter?.call(input, nextValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div style={{ display: "grid", gap: ".45rem" }}>
      <InputGroup
        leading={leading ?? <SearchGlyph />}
        trailing={showClear ? <ClearButton onClear={() => {
          if (isControlled) {
            emitInputValue("");
          } else {
            setUncontrolledValue("");
            onValueChange?.("");
          }

          onClear?.();
          inputRef.current?.focus();
          requestAnimationFrame(() => inputRef.current?.focus());
        }} /> : undefined}
      >
        <Input
          {...props}
          ref={inputRef}
          value={currentValue}
          onChange={(event) => {
            if (!isControlled) {
              setUncontrolledValue(event.target.value);
            }

            onValueChange?.(event.target.value);
            props.onChange?.(event);
          }}
          type="text"
          role="searchbox"
          aria-label={label}
          style={{
            borderRadius: "var(--radius-pill)",
            paddingLeft: "2.65rem",
            paddingRight: showClear ? "2.65rem" : undefined,
            ...style,
          }}
        />
      </InputGroup>
    </div>
  );
}

function ClearButton({ onClear }: { onClear?: () => void }) {
  return (
    <Button
      type="button"
      aria-label="Effacer la recherche"
      onClick={onClear}
      tone="ghost"
      size="icon"
      style={{ minHeight: "2rem", minWidth: "2rem", width: "2rem", color: "var(--text-muted)" }}
    >
      <CloseGlyph size=".85rem" stroke="2px" />
    </Button>
  );
}

function CloseGlyph({ size, stroke }: { size: string; stroke: string }) {
  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-block", width: size, height: size }}>
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: stroke, borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(45deg)" }} />
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: stroke, borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(-45deg)" }} />
    </span>
  );
}

function SearchGlyph() {
  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-block", width: "1rem", height: "1rem" }}>
      <span style={{ position: "absolute", left: ".05rem", top: ".05rem", width: ".62rem", height: ".62rem", border: "2px solid currentColor", borderRadius: "var(--radius-pill)" }} />
      <span style={{ position: "absolute", right: ".05rem", bottom: ".12rem", width: ".42rem", height: "2px", background: "currentColor", transform: "rotate(45deg)", transformOrigin: "center" }} />
    </span>
  );
}
