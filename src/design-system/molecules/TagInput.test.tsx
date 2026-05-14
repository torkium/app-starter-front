import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TagInput } from "@/design-system/molecules/TagInput";

describe("TagInput", () => {
  it("keeps a stable input and announces when the maximum is reached", () => {
    render(
      <TagInput
        label="Tags"
        value={["rapide", "urgent"]}
        onChange={() => undefined}
        max={2}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Tags" });
    expect(input.getAttribute("aria-readonly")).toBe("true");
    expect(input.getAttribute("placeholder")).toBe("Maximum atteint");
    expect(screen.getByRole("status").textContent).toContain("2 sur 2 tags");
  });

  it("disables the real input when the whole tag input is disabled", () => {
    render(<TagInput label="Tags" value={["rapide"]} onChange={() => undefined} disabled />);

    expect((screen.getByRole("combobox", { name: "Tags" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("allows keyboard removal when the maximum is reached", () => {
    const handleChange = vi.fn();
    render(<TagInput label="Tags" value={["rapide", "urgent"]} onChange={handleChange} max={2} />);

    fireEvent.keyDown(screen.getByRole("combobox", { name: "Tags" }), { key: "Backspace" });

    expect(handleChange).toHaveBeenCalledWith(["rapide"]);
  });

  it("announces removals and uses focusable remove buttons", () => {
    const handleChange = vi.fn();
    render(<TagInput label="Tags" value={["rapide"]} onChange={handleChange} />);

    const removeButton = screen.getByRole("button", { name: "Retirer rapide" });
    expect(removeButton.className).toContain("ui-focus-ring");
    fireEvent.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(screen.getByRole("status").textContent).toContain("rapide supprimé");
  });

  it("submits tags with hidden inputs when a name is provided", () => {
    render(
      <form aria-label="Formulaire">
        <TagInput label="Tags" name="tags" value={["rapide", "urgent"]} onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).getAll("tags")).toEqual(["rapide", "urgent"]);
  });

  it("requires at least one tag on the visible control", () => {
    const { rerender } = render(
      <TagInput label="Tags" name="tags" value={[]} onChange={() => undefined} required />,
    );

    expect((screen.getByRole("combobox", { name: "Tags" }) as HTMLInputElement).validity.customError).toBe(true);

    rerender(<TagInput label="Tags" name="tags" value={["rapide"]} onChange={() => undefined} required />);

    expect((screen.getByRole("combobox", { name: "Tags" }) as HTMLInputElement).validity.customError).toBe(false);
  });

  it("keeps aria-activedescendant on an existing suggestion when matches shrink", () => {
    render(
      <TagInput
        label="Tags"
        value={[]}
        onChange={() => undefined}
        suggestions={["alpha", "projet", "client"]}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Tags" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.change(input, { target: { value: "cli" } });

    const activeId = input.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    expect(document.getElementById(activeId as string)).not.toBeNull();
  });
});
