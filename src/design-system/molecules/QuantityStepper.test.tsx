import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuantityStepper } from "@/design-system/molecules/QuantityStepper";

describe("QuantityStepper", () => {
  it("exposes a labelled group and live output", () => {
    render(<QuantityStepper label="Quantité" value={120} onChange={() => undefined} unit="g" />);

    expect(screen.getByRole("group", { name: "Quantité" })).not.toBeNull();
    expect(screen.getByLabelText("Quantité actuel : 120 g").tagName).toBe("OUTPUT");
  });

  it("uses unitLabel for non-text visual units", () => {
    render(<QuantityStepper label="Portions" value={2} onChange={() => undefined} unit={<strong>x</strong>} unitLabel="portions" />);

    expect(screen.getByLabelText("Portions actuel : 2 portions").tagName).toBe("OUTPUT");
  });
});
