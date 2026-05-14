"use client";

import { cloneElement, isValidElement, useId, useState } from "react";

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom";
};

export function Tooltip({ content, children, placement = "top" }: TooltipProps) {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);

  if (!isValidElement<Record<string, unknown>>(children)) {
    return children;
  }

  const childProps = children.props;
  const describedBy = [childProps["aria-describedby"], tooltipId]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  const trigger = cloneElement(children, {
    "aria-describedby": describedBy,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false);
      }

      if (typeof childProps.onKeyDown === "function") {
        childProps.onKeyDown(event);
      }
    },
    onPointerDown: (event: React.PointerEvent) => {
      setVisible(true);
      if (typeof childProps.onPointerDown === "function") {
        childProps.onPointerDown(event);
      }
    },
    onBlur: (event: React.FocusEvent) => {
      setVisible(false);
      if (typeof childProps.onBlur === "function") {
        childProps.onBlur(event);
      }
    },
    onFocus: (event: React.FocusEvent) => {
      setVisible(true);
      if (typeof childProps.onFocus === "function") {
        childProps.onFocus(event);
      }
    },
    onMouseEnter: (event: React.MouseEvent) => {
      setVisible(true);
      if (typeof childProps.onMouseEnter === "function") {
        childProps.onMouseEnter(event);
      }
    },
    onMouseLeave: (event: React.MouseEvent) => {
      setVisible(false);
      if (typeof childProps.onMouseLeave === "function") {
        childProps.onMouseLeave(event);
      }
    },
  });

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!visible}
        style={{
          position: "absolute",
          zIndex: "var(--z-toast)",
          left: "50%",
          bottom: placement === "top" ? "calc(100% + .45rem)" : undefined,
          top: placement === "bottom" ? "calc(100% + .45rem)" : undefined,
          maxWidth: "16rem",
          width: "max-content",
          transform: "translateX(-50%)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-contrast)",
          color: "var(--text-inverse)",
          fontSize: ".78rem",
          lineHeight: 1.35,
          opacity: visible ? 1 : 0,
          padding: ".35rem .55rem",
          pointerEvents: "none",
          transition: "opacity 0.16s ease",
          visibility: visible ? "visible" : "hidden",
        }}
      >
        {content}
      </span>
    </span>
  );
}
