import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/design-system/primitives/atoms/Input";
import { Field } from "@/design-system/molecules/Field";

describe("Field", () => {
  it("labels a render-prop control by default", () => {
    render(
      <Field label="Nom" hint="Visible sur le projet.">
        {() => <Input />}
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Nom" });
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
    expect(document.getElementById(input.getAttribute("aria-describedby") as string)?.textContent).toBe("Visible sur le projet.");
  });

  it("keeps the label linked to a render-prop control with its own id", () => {
    render(
      <Field label="Nom">
        {() => <Input id="project-name" />}
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Nom" });
    expect(input.getAttribute("id")).toBe("project-name");
    expect(document.querySelector("label")?.getAttribute("for")).toBe("project-name");
  });

  it("keeps group labelling explicit for grouped render-prop controls", () => {
    render(
      <Field label="Metrics" labelMode="group">
        {({ id }) => (
          <div>
            <Input id={`${id}-scope`} aria-label="Périmètre" />
            <Input id={`${id}-status`} aria-label="Statut" />
          </div>
        )}
      </Field>,
    );

    expect(screen.getByRole("group", { name: "Metrics" })).not.toBeNull();
    expect(screen.getByRole("textbox", { name: "Périmètre" })).not.toBeNull();
  });
});
