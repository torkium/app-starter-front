"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/design-system/primitives/atoms/Badge";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";

export type TagInputProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  suggestions?: readonly string[];
  max?: number;
  placeholder?: string;
  hint?: React.ReactNode;
};

export function TagInput({
  label,
  value,
  onChange,
  id,
  name,
  disabled = false,
  required = false,
  suggestions = [],
  max = 6,
  placeholder = "Ajouter un tag",
  hint,
}: TagInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const statusId = `${inputId}-status`;
  const listboxId = `${inputId}-suggestions`;
  const requiredMessage = `${label} : ajoutez au moins un tag.`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const normalizedQuery = query.trim();
  const canEdit = !disabled;
  const canAdd = canEdit && value.length < max;
  const statusText = announcement || `${value.length} sur ${max} tags`;

  const matches = useMemo(() => {
    const lowerQuery = normalizedQuery.toLowerCase();

    return suggestions
      .filter((suggestion) => !value.includes(suggestion))
      .filter((suggestion) => !lowerQuery || suggestion.toLowerCase().includes(lowerQuery))
      .slice(0, 8);
  }, [normalizedQuery, suggestions, value]);
  const safeActiveIndex = matches.length > 0 ? Math.min(activeIndex, matches.length - 1) : 0;

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && value.length === 0 ? requiredMessage : "");
  }, [required, requiredMessage, value.length]);

  function addTag(tag: string) {
    const nextTag = tag.trim();

    if (disabled || !nextTag || value.includes(nextTag) || value.length >= max) {
      return;
    }

    onChange([...value, nextTag]);
    setAnnouncement(`${nextTag} ajouté. ${value.length + 1} sur ${max} tags.`);
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
  }

  function removeTag(tag: string) {
    if (disabled) {
      return;
    }

    onChange(value.filter((item) => item !== tag));
    setAnnouncement(`${tag} supprimé. ${Math.max(0, value.length - 1)} sur ${max} tags.`);
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: "grid", gap: ".5rem" }}>
      {name ? value.map((tag) => <input key={tag} type="hidden" name={name} value={tag} disabled={disabled} />) : null}
      <label htmlFor={inputId} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontWeight: 600 }}>
        <span>{label}</span>
        <span style={{ color: "var(--text-muted)", fontSize: ".86rem", fontWeight: 500 }}>
          {value.length}/{max}
        </span>
      </label>
      <div
        className="ui-tag-input"
        data-disabled={disabled || undefined}
        style={{
          padding: ".45rem",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: ".4rem" }}>
          {value.map((tag) => (
            <Badge key={tag} tone="primary">
              <span>{tag}</span>
              <button
                type="button"
                className="ui-focus-ring"
                aria-label={`Retirer ${tag}`}
                disabled={disabled}
                onClick={() => removeTag(tag)}
                style={{
                  display: "inline-grid",
                  width: "1.5rem",
                  height: "1.5rem",
                  placeItems: "center",
                  border: 0,
                  borderRadius: "var(--radius-pill)",
                  background: "transparent",
                  color: "inherit",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.58 : undefined,
                  fontWeight: 700,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                <CloseGlyph />
              </button>
            </Badge>
          ))}
          <div style={{ position: "relative", flex: "1 1 10rem", minWidth: "10rem" }}>
              <Input
                ref={inputRef}
                id={inputId}
                role="combobox"
                aria-autocomplete="list"
                aria-controls={open && matches.length > 0 ? listboxId : undefined}
                aria-expanded={open && matches.length > 0}
                aria-activedescendant={open && matches[safeActiveIndex] ? `${listboxId}-${safeActiveIndex}` : undefined}
                aria-label={label}
                aria-describedby={[hintId, statusId].filter(Boolean).join(" ") || undefined}
                aria-disabled={disabled || undefined}
                aria-readonly={!disabled && !canAdd ? true : undefined}
                aria-required={required || undefined}
                disabled={disabled}
                readOnly={!canAdd}
                value={query}
                onBlur={() => window.setTimeout(() => setOpen(false), 120)}
                onChange={(event) => {
                  if (!canAdd) {
                    return;
                  }

                  setQuery(event.target.value);
                  setOpen(true);
                  setActiveIndex(0);
                }}
                onFocus={() => setOpen(canAdd)}
                onKeyDown={(event) => {
                  if (!canEdit) {
                    return;
                  }

                  if (event.key === "Backspace" && !query && value.length > 0) {
                    event.preventDefault();
                    removeTag(value[value.length - 1] ?? "");
                    return;
                  }

                  if (!canAdd) {
                    return;
                  }

                  if (event.key === "ArrowDown" && matches.length > 0) {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((index) => (index + 1) % matches.length);
                    return;
                  }

                  if (event.key === "ArrowUp" && matches.length > 0) {
                    event.preventDefault();
                    setOpen(true);
                    setActiveIndex((index) => (index - 1 + matches.length) % matches.length);
                    return;
                  }

                  if (event.key === "Escape") {
                    if (open) {
                      event.preventDefault();
                      setOpen(false);
                    }
                    return;
                  }

                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addTag(open && matches[safeActiveIndex] ? matches[safeActiveIndex] : query);
                  }
                }}
                onInvalid={(event) => {
                  event.currentTarget.setCustomValidity(requiredMessage);
                  inputRef.current?.focus();
                }}
                placeholder={!canAdd ? "Maximum atteint" : value.length === 0 ? placeholder : ""}
                style={{ borderColor: "transparent", background: "transparent", boxShadow: "none", padding: ".45rem .5rem" }}
              />
              {open && matches.length > 0 ? (
                <div
                  id={listboxId}
                  role="listbox"
                  style={{
                    position: "absolute",
                    zIndex: "var(--z-raised)",
                    top: "calc(100% + .35rem)",
                    left: 0,
                    right: 0,
                    display: "grid",
                    gap: ".2rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--surface-strong)",
                    boxShadow: "var(--shadow-md)",
                    padding: ".35rem",
                  }}
                >
                  {matches.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      id={`${listboxId}-${index}`}
                      role="option"
                      aria-selected={index === safeActiveIndex}
                      onPointerDown={(event) => {
                        event.preventDefault();
                        addTag(suggestion);
                      }}
                      style={{
                        border: 0,
                        borderRadius: "var(--radius-xs)",
                        background: index === safeActiveIndex ? "var(--primary-soft)" : "transparent",
                        color: "var(--text)",
                        cursor: "pointer",
                        padding: ".5rem .65rem",
                        textAlign: "left",
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              ) : null}
          </div>
        </div>
      </div>
      {hint ? <span id={hintId} style={{ color: "var(--text-muted)", fontSize: ".92rem" }}>{hint}</span> : null}
      <span id={statusId} role="status" aria-live="polite" className="sr-only">
        {statusText}
      </span>
      {normalizedQuery && canAdd ? (
        <Button type="button" tone="ghost" size="sm" onClick={() => addTag(query)} style={{ justifySelf: "start" }}>
          Ajouter &quot;{normalizedQuery}&quot;
        </Button>
      ) : null}
    </div>
  );
}

function CloseGlyph() {
  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-block", width: ".65rem", height: ".65rem" }}>
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(45deg)" }} />
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(-45deg)" }} />
    </span>
  );
}
