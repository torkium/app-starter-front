import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SegmentedControl } from "@/design-system/molecules/SegmentedControl";

const options = [
  { value: "week", label: "Semaine" },
  { value: "month", label: "Mois" },
  { value: "locked", label: "Verrouillé", disabled: true },
];

describe("SegmentedControl", () => {
  it("submits the selected value when a name is provided", () => {
    render(
      <form aria-label="Formulaire">
        <SegmentedControl label="Vue" name="view" options={options} value="week" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("view")).toBe("week");
  });

  it("does not submit a stale or disabled selected value", () => {
    const { rerender } = render(
      <form aria-label="Formulaire">
        <SegmentedControl label="Vue" name="view" options={options} value="missing" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("view")).toBeNull();

    rerender(
      <form aria-label="Formulaire">
        <SegmentedControl label="Vue" name="view" options={options} value="locked" onChange={() => undefined} />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("view")).toBeNull();
  });
});
