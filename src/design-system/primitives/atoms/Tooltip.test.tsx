import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "@/design-system/primitives/atoms/Tooltip";

describe("Tooltip", () => {
  it("keeps child handlers while showing and hiding the tooltip", () => {
    const handleFocus = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <Tooltip content="Aide contextuelle">
        <button type="button" onFocus={handleFocus} onKeyDown={handleKeyDown}>Aide</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button", { name: "Aide" });
    const tooltip = screen.getByRole("tooltip", { hidden: true });

    fireEvent.focus(button);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(tooltip.getAttribute("aria-hidden")).toBe("false");

    fireEvent.keyDown(button, { key: "Escape" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(tooltip.getAttribute("aria-hidden")).toBe("true");
  });
});
