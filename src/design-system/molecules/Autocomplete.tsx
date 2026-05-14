"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Input, type InputProps } from "@/design-system/primitives/atoms/Input";

export type AutocompleteOption<TData = unknown> = {
  id: string;
  textValue: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  data?: TData;
};

type AutocompleteBaseProps<TData> = Omit<InputProps, "value" | "defaultValue" | "onChange" | "onSelect" | "children" | "type"> & {
  label: string;
  options: AutocompleteOption<TData>[];
  onSelect: (option: AutocompleteOption<TData>) => void;
  selectedOption?: AutocompleteOption<TData>;
  suggestions?: AutocompleteOption<TData>[];
  placeholder?: string;
  loading?: boolean;
  error?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  sourceLabel?: React.ReactNode;
  compact?: boolean;
  minQueryLength?: number;
  defaultOpen?: boolean;
};

type ControlledAutocompleteProps = {
  query: string;
  onQueryChange: (query: string) => void;
  defaultQuery?: never;
};

type UncontrolledAutocompleteProps = {
  query?: never;
  onQueryChange?: (query: string) => void;
  defaultQuery?: string;
};

export type AutocompleteProps<TData = unknown> = AutocompleteBaseProps<TData> & (
  | ControlledAutocompleteProps
  | UncontrolledAutocompleteProps
);

export function Autocomplete<TData = unknown>({
  label,
  options,
  onSelect,
  selectedOption,
  suggestions = [],
  placeholder = "Rechercher...",
  query,
  onQueryChange,
  defaultQuery = "",
  loading = false,
  error,
  emptyMessage = "Aucun résultat",
  sourceLabel,
  compact = false,
  minQueryLength = 0,
  defaultOpen = false,
  id,
  name,
  disabled,
  readOnly,
  required,
  autoFocus,
  className,
  style,
  ...inputProps
}: AutocompleteProps<TData>) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const listboxId = `${inputId}-listbox`;
  const statusId = `${inputId}-status`;
  const selectionRequiredMessage = `${label} : sélection obligatoire.`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldFocusInputRef = useRef(Boolean(autoFocus));
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(defaultOpen ? 0 : -1);
  const currentQuery = query ?? internalQuery;
  const canEdit = !disabled && !readOnly;
  const trimmedQueryLength = currentQuery.trim().length;
  const canShowResults = trimmedQueryLength >= minQueryLength;
  const visibleOptions = canShowResults ? options : suggestions;
  const safeActiveIndex = visibleOptions.length > 0 ? Math.max(0, Math.min(activeIndex, visibleOptions.length - 1)) : 0;
  const activeOption = visibleOptions[safeActiveIndex];
  const hasFeedback = loading || Boolean(error) || visibleOptions.length === 0;
  const showOptions = open && visibleOptions.length > 0;
  const showFeedback = open && (loading || Boolean(error) || (visibleOptions.length === 0 && canShowResults));
  const showPanel = showOptions || showFeedback;
  const confirmedSelectedOption = selectedOption && !open ? selectedOption : undefined;
  const invalid = Boolean(error) || inputProps["aria-invalid"];
  const feedbackMessage = loading
    ? "Recherche en cours"
    : error ?? (!canShowResults && minQueryLength > 0 ? `Saisissez au moins ${minQueryLength} caractères` : emptyMessage);
  const describedBy = [inputProps["aria-describedby"], statusId]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open && shouldFocusInputRef.current) {
      inputRef.current?.focus();
      shouldFocusInputRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && !confirmedSelectedOption ? selectionRequiredMessage : "");
  }, [confirmedSelectedOption, required, selectionRequiredMessage]);

  function updateQuery(nextQuery: string) {
    if (!canEdit) {
      return;
    }

    if (query === undefined) {
      setInternalQuery(nextQuery);
    }
    setActiveIndex(-1);
    onQueryChange?.(nextQuery);
  }

  function openInputAndFocus() {
    if (!canEdit) {
      return;
    }

    shouldFocusInputRef.current = true;
    setOpen(true);
    updateQuery("");
  }

  function selectOption(option: AutocompleteOption<TData>) {
    if (!canEdit) {
      return;
    }

    onSelect(option);
    updateQuery("");
    setOpen(false);
  }

  function moveActiveIndex(direction: 1 | -1) {
    if (!canEdit) {
      return;
    }

    if (visibleOptions.length === 0) {
      return;
    }

    if (!open) {
      setOpen(true);
      setActiveIndex(direction === 1 ? 0 : visibleOptions.length - 1);
      return;
    }

    setOpen(true);
    setActiveIndex((index) => (index + direction + visibleOptions.length) % visibleOptions.length);
  }

  return (
    <div
      ref={rootRef}
      onBlur={(event) => {
        const nextFocusedElement = event.relatedTarget;
        if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
          return;
        }

        setOpen(false);
      }}
      style={{ position: "relative", width: "100%" }}
    >
      {name && confirmedSelectedOption ? <input type="hidden" name={name} value={confirmedSelectedOption.id} disabled={disabled} /> : null}
      {selectedOption && !open ? (
        <button
          type="button"
          className="ui-focus-ring"
          aria-haspopup="listbox"
          aria-expanded={false}
          aria-controls={listboxId}
          aria-label={
            readOnly
              ? `${label}, sélection actuelle : ${selectedOption.textValue}. Lecture seule`
              : `${label}, sélection actuelle : ${selectedOption.textValue}. Modifier`
          }
          disabled={disabled}
          onClick={openInputAndFocus}
          style={{
            display: "flex",
            width: "100%",
            minHeight: compact ? "var(--control-height-sm)" : "var(--control-height-md)",
            alignItems: "center",
            justifyContent: "space-between",
            gap: ".75rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            background: "var(--input-background)",
            color: "var(--text)",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.58 : undefined,
            padding: "0.6rem .9rem",
            textAlign: "left",
            ...style,
          }}
        >
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
            {selectedOption.label}
          </span>
          {selectedOption.meta ? <span style={{ flex: "0 0 auto", color: "var(--text-muted)", fontSize: ".72rem" }}>{selectedOption.meta}</span> : null}
        </button>
      ) : (
        <div style={{ position: "relative" }}>
          <SearchGlyph />
          <Input
            {...inputProps}
            ref={inputRef}
            id={inputId}
            role="combobox"
            aria-autocomplete="list"
            aria-controls={showOptions ? listboxId : undefined}
            aria-expanded={showPanel}
            aria-activedescendant={showOptions && activeOption ? `${listboxId}-${safeActiveIndex}` : undefined}
            aria-label={inputProps["aria-label"] ?? label}
            aria-busy={loading || undefined}
            aria-describedby={describedBy || undefined}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            autoComplete="off"
            value={currentQuery}
            className={className}
            onChange={(event) => {
              updateQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={(event) => {
              inputProps.onFocus?.(event);
              if (!canEdit) {
                return;
              }

              setOpen(true);
              setActiveIndex(-1);
            }}
            onBlur={(event) => {
              inputProps.onBlur?.(event);
            }}
            onKeyDown={(event) => {
              inputProps.onKeyDown?.(event);
              if (event.defaultPrevented) {
                return;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                moveActiveIndex(1);
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                moveActiveIndex(-1);
                return;
              }

              if (event.altKey && event.key === "Home" && visibleOptions.length > 0) {
                event.preventDefault();
                setActiveIndex(0);
                return;
              }

              if (event.altKey && event.key === "End" && visibleOptions.length > 0) {
                event.preventDefault();
                setActiveIndex(visibleOptions.length - 1);
                return;
              }

              if (event.key === "Enter" && showPanel && activeOption) {
                event.preventDefault();
                selectOption(activeOption);
                return;
              }

              if (event.key === "Escape") {
                if (open || showPanel) {
                  event.preventDefault();
                  setOpen(false);
                }
              }
            }}
            onInvalid={(event) => {
              event.currentTarget.setCustomValidity(selectionRequiredMessage);
              inputProps.onInvalid?.(event);
              inputRef.current?.focus();
            }}
            placeholder={placeholder}
            style={{
              minHeight: compact ? "var(--control-height-sm)" : undefined,
              paddingLeft: "2.35rem",
              paddingRight: loading || currentQuery ? "2.65rem" : undefined,
              ...style,
            }}
          />
          <span style={{ position: "absolute", right: ".45rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "grid", placeItems: "center" }}>
            {loading ? <SpinnerGlyph /> : currentQuery && canEdit ? (
              <button
                type="button"
                className="ui-focus-ring"
                aria-label="Effacer la recherche"
                disabled={disabled}
                onClick={() => {
                  updateQuery("");
                  setOpen(true);
                  inputRef.current?.focus();
                }}
                style={{
                  display: "grid",
                  width: "2rem",
                  height: "2rem",
                  placeItems: "center",
                  border: 0,
                  borderRadius: "var(--radius-pill)",
                  background: "transparent",
                  color: "inherit",
                  cursor: disabled ? "not-allowed" : "pointer",
                  padding: 0,
                }}
              >
                <CloseGlyph />
              </button>
            ) : null}
          </span>
        </div>
      )}

      {showPanel ? (
        <div
          style={{
            position: "absolute",
            zIndex: "var(--z-overlay)",
            top: "calc(100% + .35rem)",
            left: 0,
            right: 0,
            overflow: "hidden",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-strong)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ maxHeight: "18rem", overflow: "auto", padding: ".35rem" }}>
            {showOptions ? (
              <div id={listboxId} role="listbox" aria-label={label}>
                {visibleOptions.map((option, index) => (
                  <div
                    key={option.id}
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-label={option.textValue}
                    aria-selected={index === safeActiveIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      selectOption(option);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: ".75rem",
                      borderRadius: "var(--radius-sm)",
                      background: index === safeActiveIndex ? "var(--primary-soft)" : "transparent",
                      color: "var(--text)",
                      cursor: "pointer",
                      padding: ".65rem .75rem",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ display: "grid", gap: ".12rem", minWidth: 0 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{option.label}</span>
                      {option.description ? <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: ".78rem" }}>{option.description}</span> : null}
                    </span>
                    {option.meta ? <span style={{ flex: "0 0 auto", color: "var(--text-muted)", fontSize: ".72rem", textAlign: "right" }}>{option.meta}</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
            {visibleOptions.length === 0 && !loading ? (
              <div
                role={error ? "alert" : "status"}
                aria-live={error ? "assertive" : "polite"}
                style={{ padding: ".85rem", color: error ? "var(--danger)" : "var(--text-muted)", fontSize: ".86rem", textAlign: "center" }}
              >
                {feedbackMessage}
              </div>
            ) : null}
            {loading ? (
              <div
                role="status"
                aria-live="polite"
                style={{ display: "flex", justifyContent: "center", gap: ".5rem", padding: ".75rem", color: "var(--text-muted)", fontSize: ".82rem" }}
              >
                <SpinnerGlyph /> {feedbackMessage}
              </div>
            ) : null}
          </div>
          {sourceLabel ? (
            <div style={{ borderTop: "1px solid var(--border)", background: "var(--surface-subtle)", color: "var(--text-muted)", fontSize: ".72rem", padding: ".4rem .75rem" }}>
              {sourceLabel}
            </div>
          ) : null}
        </div>
      ) : null}
      <span id={statusId} className="sr-only" aria-live={error ? "assertive" : "polite"}>
        {hasFeedback ? feedbackMessage : `${visibleOptions.length} résultat${visibleOptions.length > 1 ? "s" : ""} disponible${visibleOptions.length > 1 ? "s" : ""}`}
      </span>
    </div>
  );
}

function SearchGlyph() {
  return (
    <span aria-hidden="true" style={{ position: "absolute", left: ".8rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "inline-block", width: "1rem", height: "1rem" }}>
      <span style={{ position: "absolute", left: ".05rem", top: ".05rem", width: ".62rem", height: ".62rem", border: "2px solid currentColor", borderRadius: "var(--radius-pill)" }} />
      <span style={{ position: "absolute", right: ".05rem", bottom: ".12rem", width: ".42rem", height: "2px", background: "currentColor", transform: "rotate(45deg)", transformOrigin: "center" }} />
    </span>
  );
}

function CloseGlyph() {
  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-block", width: ".75rem", height: ".75rem" }}>
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(45deg)" }} />
      <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", borderRadius: "var(--radius-pill)", background: "currentColor", transform: "rotate(-45deg)" }} />
    </span>
  );
}

function SpinnerGlyph() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: ".9rem",
        height: ".9rem",
        border: "2px solid currentColor",
        borderRightColor: "transparent",
        borderRadius: "var(--radius-pill)",
        animation: "ui-spin 0.72s linear infinite",
      }}
    />
  );
}
