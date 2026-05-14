import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/design-system/primitives/atoms/Button";

describe("Button", () => {
  it("defaults to type button", () => {
    render(<Button>Enregistrer</Button>);

    expect((screen.getByRole("button", { name: "Enregistrer" }) as HTMLButtonElement).type).toBe("button");
  });

  it("disables itself while loading", () => {
    render(<Button loading>Enregistrer</Button>);

    const button = screen.getByRole("button", { name: "Enregistrer" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });
});
