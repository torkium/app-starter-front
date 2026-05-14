import Link from "next/link";
import type React from "react";
import { cn } from "@/shared/utils/cn";
import type { ButtonSize, ButtonTone } from "@/design-system/primitives/atoms/Button.types";

export type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, "onClick"> & {
  tone?: ButtonTone;
  size?: ButtonSize;
  isDisabled?: boolean;
  fullWidth?: boolean;
};

export function ButtonLink({
  children,
  tone = "primary",
  size = "md",
  isDisabled = false,
  fullWidth = false,
  className,
  style,
  tabIndex,
  ...props
}: ButtonLinkProps) {
  const disabledSpanProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => (
      key === "id"
      || key === "role"
      || key === "title"
      || key.startsWith("aria-")
      || key.startsWith("data-")
    )),
  ) as React.HTMLAttributes<HTMLSpanElement>;

  if (isDisabled) {
    return (
      <span
        {...disabledSpanProps}
        aria-disabled="true"
        className={cn("ui-button", "ui-focus-ring", className)}
        data-size={size}
        data-tone={tone}
        style={{ width: fullWidth ? "100%" : undefined, ...style }}
      >
        <span className="ui-button__content">{children}</span>
      </span>
    );
  }

  return (
    <Link
      {...props}
      className={cn("ui-button", "ui-focus-ring", className)}
      data-size={size}
      data-tone={tone}
      style={{ width: fullWidth ? "100%" : undefined, ...style }}
      tabIndex={tabIndex}
    >
      <span className="ui-button__content">{children}</span>
    </Link>
  );
}
