import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Notice } from "@/design-system/molecules/Notice";

describe("Notice", () => {
  it("uses live semantics by default", () => {
    render(<Notice tone="warning">Attention</Notice>);

    expect(screen.getByRole("alert").getAttribute("aria-live")).toBe("assertive");
  });

  it("does not expose live semantics when live is false", () => {
    const { container } = render(<Notice tone="warning" live={false}>Attention</Notice>);
    const notice = container.firstElementChild;

    expect(screen.queryByRole("alert")).toBeNull();
    expect(notice?.getAttribute("role")).toBeNull();
    expect(notice?.getAttribute("aria-live")).toBeNull();
  });
});
