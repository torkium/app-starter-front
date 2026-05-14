import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "@/design-system/molecules/DropdownMenu";

describe("DropdownMenu", () => {
  it("moves focus through menu items and selects the focused item", () => {
    const firstAction = vi.fn();
    const secondAction = vi.fn();
    render(
      <DropdownMenu
        label="Actions"
        trigger="Ouvrir"
        items={[
          { id: "first", label: "Premier", onSelect: firstAction },
          { id: "second", label: "Second", onSelect: secondAction },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));
    expect(screen.getByRole("button", { name: "Ouvrir" }).getAttribute("aria-controls")).toBe(screen.getByRole("menu").id);
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Premier" }), { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Premier" }).getAttribute("tabindex")).toBe("-1");
    expect(screen.getByRole("menuitem", { name: "Second" }).getAttribute("tabindex")).toBe("0");
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Second" }), { key: "Enter" });

    expect(firstAction).not.toHaveBeenCalled();
    expect(secondAction).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Ouvrir" }));
  });

  it("closes after tabbing away from a menu item", async () => {
    render(
      <DropdownMenu
        label="Actions"
        trigger="Ouvrir"
        items={[{ id: "first", label: "Premier" }]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Premier" }), { key: "Tab" });
    expect(screen.getByRole("menu")).not.toBeNull();

    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("opens on ArrowUp and focuses the last menu item", () => {
    render(
      <DropdownMenu
        label="Actions"
        trigger="Ouvrir"
        items={[
          { id: "first", label: "Premier" },
          { id: "second", label: "Second" },
        ]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "Ouvrir" }), { key: "ArrowUp" });

    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Second" }));
  });
});
