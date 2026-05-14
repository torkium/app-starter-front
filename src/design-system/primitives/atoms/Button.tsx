"use client";

import type React from "react";
import { cn } from "@/shared/utils/cn";
import type { ButtonSize, ButtonTone } from "@/design-system/primitives/atoms/Button.types";

export type { ButtonSize, ButtonTone } from "@/design-system/primitives/atoms/Button.types";

export type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  children,
  tone = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  style,
  ref,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      data-loading={loading || undefined}
      data-size={size}
      data-tone={tone}
      className={cn("ui-button", "ui-focus-ring", className)}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
    >
      {loading ? <span className="ui-button__spinner" aria-hidden="true" /> : null}
      <span className="ui-button__content">{children}</span>
    </button>
  );
}
