import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChoiceGroup } from "@/design-system/molecules/ChoiceGroup";

const options = [
  { value: "manual", title: "Manuel" },
  { value: "import", title: "Import" },
  { value: "locked", title: "Verrouillé", disabled: true },
];

describe("ChoiceGroup", () => {
  it("supports radio keyboard navigation", () => {
    const handleChange = vi.fn();
    render(<ChoiceGroup label="Mode" options={options} value="manual" onChange={handleChange} />);

    fireEvent.keyDown(screen.getByRole("radio", { name: "Manuel" }), { key: "ArrowRight" });

    expect(handleChange).toHaveBeenCalledWith("import");
  });

  it("keeps one enabled option tabbable when value is invalid", () => {
    render(<ChoiceGroup label="Mode" options={options} value="missing" onChange={() => undefined} />);

    expect(screen.getByRole("radio", { name: "Manuel" }).getAttribute("tabindex")).toBe("0");
  });

  it("submits the selected value when a name is provided", () => {
    render(
      <form aria-label="Formulaire">
        <ChoiceGroup label="Mode" name="mode" options={options} value="import" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("mode")).toBe("import");
  });

  it("does not submit a stale or disabled selected value", () => {
    const { rerender } = render(
      <form aria-label="Formulaire">
        <ChoiceGroup label="Mode" name="mode" options={options} value="missing" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("mode")).toBeNull();

    rerender(
      <form aria-label="Formulaire">
        <ChoiceGroup label="Mode" name="mode" options={options} value="locked" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("mode")).toBeNull();
  });
});
