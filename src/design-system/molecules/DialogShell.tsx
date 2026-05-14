"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/design-system/primitives/atoms/Button";

export type DialogShellProps = {
  open: boolean;
  title: React.ReactNode;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  media?: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  role?: "dialog" | "alertdialog";
  initialFocusRef?: RefObject<HTMLElement | null>;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const sizeMap = {
  sm: "28rem",
  md: "42rem",
  lg: "56rem",
} as const;

const activeDialogPortals: HTMLElement[] = [];
const originalBodyChildState = new Map<Element, { ariaHidden: string | null; inert: boolean }>();
let originalBodyOverflow: string | null = null;
let lastConnectedRestoreTarget: HTMLElement | null = null;

function isTopmostDialogPortal(portalElement: HTMLElement) {
  return activeDialogPortals.at(-1) === portalElement;
}

function removeDialogPortalFromStack(portalElement: HTMLElement) {
  const index = activeDialogPortals.lastIndexOf(portalElement);
  if (index >= 0) {
    activeDialogPortals.splice(index, 1);
  }
}

function restoreBodyChildState(element: Element) {
  const originalState = originalBodyChildState.get(element);
  if (!originalState) {
    return;
  }

  if (originalState.ariaHidden === null) {
    element.removeAttribute("aria-hidden");
  } else {
    element.setAttribute("aria-hidden", originalState.ariaHidden);
  }
  (element as HTMLElement).inert = originalState.inert;
}

function syncDialogStackState() {
  if (typeof document === "undefined") {
    return;
  }

  const bodyChildren = Array.from(document.body.children);
  const topmostPortal = activeDialogPortals.at(-1);

  if (!topmostPortal) {
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow;
      originalBodyOverflow = null;
    }

    bodyChildren.forEach(restoreBodyChildState);
    originalBodyChildState.clear();
    return;
  }

  if (originalBodyOverflow === null) {
    originalBodyOverflow = document.body.style.overflow;
  }

  document.body.style.overflow = "hidden";
  bodyChildren.forEach((element) => {
    if (!originalBodyChildState.has(element)) {
      originalBodyChildState.set(element, {
        ariaHidden: element.getAttribute("aria-hidden"),
        inert: Boolean((element as HTMLElement).inert),
      });
    }

    if (element === topmostPortal) {
      restoreBodyChildState(element);
      return;
    }

    element.setAttribute("aria-hidden", "true");
    (element as HTMLElement).inert = true;
  });
}

function restoreFocus(target: HTMLElement | null) {
  if (target?.isConnected) {
    lastConnectedRestoreTarget = target;
    target.focus();
    return;
  }

  if (lastConnectedRestoreTarget?.isConnected) {
    lastConnectedRestoreTarget.focus();
  }
}

export function DialogShell({
  open,
  title,
  eyebrow,
  description,
  children,
  footer,
  media,
  onClose,
  size = "md",
  role = "dialog",
  initialFocusRef,
}: DialogShellProps) {
  const titleId = useId();
  const descriptionId = useId();
  const describedBy = description ? descriptionId : undefined;
  const dialogRef = useRef<HTMLElement>(null);
  const [portalElement] = useState(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return document.createElement("div");
  });
  const onCloseRef = useRef(onClose);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || !portalElement) {
      return;
    }

    portalElement.setAttribute("data-dialog-shell-portal", "");
    document.body.appendChild(portalElement);

    return () => {
      portalElement.remove();
    };
  }, [open, portalElement]);

  useEffect(() => {
    if (!open || !portalElement) {
      return;
    }

    const activePortalElement = portalElement;
    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const firstFocusable = initialFocusRef?.current ?? dialog?.querySelector<HTMLElement>(focusableSelector);
    removeDialogPortalFromStack(activePortalElement);
    activeDialogPortals.push(activePortalElement);
    syncDialogStackState();

    firstFocusable?.focus();
    if (!firstFocusable) {
      dialog?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!isTopmostDialogPortal(activePortalElement)) {
        return;
      }

      if (event.key === "Escape") {
        if (event.defaultPrevented) {
          return;
        }

        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (!isTopmostDialogPortal(activePortalElement)) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && dialogRef.current?.contains(target)) {
        return;
      }

      const firstElement = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstElement?.focus();
      if (!firstElement) {
        dialogRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      removeDialogPortalFromStack(activePortalElement);
      syncDialogStackState();
      restoreFocus(previouslyFocusedElementRef.current);
    };
  }, [initialFocusRef, open, portalElement]);

  if (!open || !portalElement) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onCloseRef.current();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-modal)",
        display: "grid",
        placeItems: "center",
        background: "rgba(24, 35, 29, 0.34)",
        backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
    >
      <section
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        tabIndex={-1}
        style={{
          width: `min(100%, ${sizeMap[size]})`,
          maxHeight: "92vh",
          overflow: "auto",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          background: "var(--surface-strong)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {media ? <div>{media}</div> : null}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: "var(--z-raised)",
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: "1rem",
            borderBottom: "1px solid var(--border)",
            background: "color-mix(in srgb, var(--surface-strong) 94%, transparent)",
            backdropFilter: "blur(12px)",
            padding: "1rem 1.25rem",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {eyebrow ? <p style={{ margin: "0 0 .25rem", color: "var(--text-muted)", fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase" }}>{eyebrow}</p> : null}
            <h2 id={titleId} style={{ margin: 0, fontFamily: "var(--font-display)", lineHeight: 1.15, overflowWrap: "anywhere" }}>{title}</h2>
            {description ? <p id={descriptionId} style={{ margin: ".45rem 0 0", color: "var(--text-muted)", lineHeight: 1.45 }}>{description}</p> : null}
          </div>
          <Button type="button" tone="ghost" size="icon" aria-label="Fermer la fenêtre" onClick={onClose}>
            <span aria-hidden="true">x</span>
          </Button>
        </header>
        <div style={{ padding: "1.25rem" }}>{children}</div>
        {footer ? (
          <footer
            style={{
              position: "sticky",
              bottom: 0,
              display: "flex",
              justifyContent: "end",
              gap: ".75rem",
              flexWrap: "wrap",
              borderTop: "1px solid var(--border)",
              background: "color-mix(in srgb, var(--surface-strong) 94%, transparent)",
              backdropFilter: "blur(12px)",
              padding: "1rem 1.25rem",
            }}
          >
            {footer}
          </footer>
        ) : null}
      </section>
    </div>,
    portalElement,
  );
}
