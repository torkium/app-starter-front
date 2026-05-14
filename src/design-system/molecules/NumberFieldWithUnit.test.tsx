import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberFieldWithUnit } from "@/design-system/molecules/NumberFieldWithUnit";

describe("NumberFieldWithUnit", () => {
  it("exposes the unit through the accessible description", () => {
    render(<NumberFieldWithUnit label="Quantité" unit="g" />);

    const input = screen.getByRole("spinbutton", { name: "Quantité" });
    const describedBy = input.getAttribute("aria-describedby") ?? "";

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy)?.textContent).toContain("Unité : g");
  });

  it("announces errors with an alert role", () => {
    render(<NumberFieldWithUnit label="Progress" unit="%" error="La valeur doit être positive." />);

    expect(screen.getByRole("alert").textContent).toContain("La valeur doit être positive.");
  });
});
