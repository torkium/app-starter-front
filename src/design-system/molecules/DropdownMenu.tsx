"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button, type ButtonTone } from "@/design-system/primitives/atoms/Button";

export type DropdownMenuItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
};

export type DropdownMenuProps = {
  label: string;
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "start" | "end";
  tone?: ButtonTone;
  triggerLabel?: string;
};

export function DropdownMenu({ label, trigger, items, align = "end", tone = "secondary", triggerLabel }: DropdownMenuProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const itemIndexes = useMemo(() => items.map((_, index) => index), [items]);

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
    if (open) {
      const nextIndex = itemIndexes.includes(focusedIndex) ? focusedIndex : itemIndexes[0];
      if (nextIndex !== undefined) {
        itemRefs.current[nextIndex]?.focus();
      }
    }
  }, [focusedIndex, itemIndexes, open]);

  function closeMenu({ restoreFocus = true } = {}) {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  function focusMenuItem(currentIndex: number, direction: 1 | -1) {
    if (itemIndexes.length === 0) {
      return;
    }

    const currentItemIndex = itemIndexes.indexOf(currentIndex);
    const nextItemPosition = currentItemIndex >= 0
      ? (currentItemIndex + direction + itemIndexes.length) % itemIndexes.length
      : 0;

    const nextIndex = itemIndexes[nextItemPosition];
    if (nextIndex !== undefined) {
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    }
  }

  function openMenu(focus = "first" as "first" | "last") {
    setFocusedIndex(focus === "last" ? itemIndexes.at(-1) ?? 0 : itemIndexes[0] ?? 0);
    setOpen(true);
  }

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <Button
        ref={triggerRef}
        type="button"
        tone={tone}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={typeof trigger === "string" ? undefined : triggerLabel ?? label}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }

          openMenu();
        }}
        onKeyDown={(event) => {
          if (["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openMenu();
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            openMenu("last");
          }
        }}
      >
        {trigger}
      </Button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          style={{
            position: "absolute",
            top: "calc(100% + .5rem)",
            right: align === "end" ? 0 : undefined,
            left: align === "start" ? 0 : undefined,
            zIndex: "var(--z-overlay)",
            display: "grid",
            gap: ".15rem",
            width: "max-content",
            minWidth: "14rem",
            maxWidth: "min(22rem, calc(100vw - 2rem))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-strong)",
            boxShadow: "var(--shadow-md)",
            padding: ".35rem",
          }}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              type="button"
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              tabIndex={index === focusedIndex ? 0 : -1}
              className="ui-focus-ring"
              onFocus={() => setFocusedIndex(index)}
              onClick={() => {
                if (item.disabled) {
                  return;
                }

                item.onSelect?.();
                closeMenu();
              }}
              onKeyDown={(event) => {
                if (["Enter", " "].includes(event.key)) {
                  event.preventDefault();
                  if (item.disabled) {
                    return;
                  }

                  item.onSelect?.();
                  closeMenu();
                  return;
                }

                if (event.key === "Tab") {
                  window.setTimeout(() => closeMenu({ restoreFocus: false }), 0);
                  return;
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  closeMenu();
                  return;
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  focusMenuItem(index, 1);
                  return;
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  focusMenuItem(index, -1);
                  return;
                }

                if (event.key === "Home") {
                  event.preventDefault();
                  const firstIndex = itemIndexes[0];
                  if (firstIndex !== undefined) {
                    setFocusedIndex(firstIndex);
                    itemRefs.current[firstIndex]?.focus();
                  }
                  return;
                }

                if (event.key === "End") {
                  event.preventDefault();
                  const lastIndex = itemIndexes.at(-1);
                  if (lastIndex !== undefined) {
                    setFocusedIndex(lastIndex);
                    itemRefs.current[lastIndex]?.focus();
                  }
                }
              }}
              style={{
                display: "grid",
                gap: ".15rem",
                width: "100%",
                border: 0,
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: item.tone === "danger" ? "var(--danger)" : "var(--text)",
                cursor: item.disabled ? "not-allowed" : "pointer",
                opacity: item.disabled ? 0.58 : undefined,
                padding: ".65rem .75rem",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: 650 }}>{item.label}</span>
              {item.description ? <span style={{ color: "var(--text-muted)", fontSize: ".82rem" }}>{item.description}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
