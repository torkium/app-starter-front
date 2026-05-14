import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ButtonLink } from "@/design-system/primitives/atoms/ButtonLink";

describe("ButtonLink", () => {
  it("renders a server-compatible link styled as a button", () => {
    render(<ButtonLink href="/login">Se connecter</ButtonLink>);

    expect(screen.getByRole("link", { name: "Se connecter" }).getAttribute("href")).toBe("/login");
  });

  it("removes disabled links from keyboard navigation", () => {
    render(<ButtonLink href="/login" isDisabled>Se connecter</ButtonLink>);

    expect(screen.queryByRole("link", { name: "Se connecter" })).toBeNull();
    expect(screen.getByText("Se connecter").closest("[aria-disabled='true']")).not.toBeNull();
  });

  it("keeps safe attributes when disabled without exposing navigation props", () => {
    render(
      <ButtonLink
        href="/login"
        isDisabled
        aria-label="Connexion indisponible"
        data-testid="disabled-link"
        title="Bientôt disponible"
      >
        <span aria-hidden="true">Icone</span>
      </ButtonLink>,
    );

    const disabledLink = screen.getByTestId("disabled-link");
    expect(disabledLink.getAttribute("aria-label")).toBe("Connexion indisponible");
    expect(disabledLink.getAttribute("title")).toBe("Bientôt disponible");
    expect(disabledLink.getAttribute("href")).toBeNull();
    expect(disabledLink.getAttribute("aria-disabled")).toBe("true");
  });
});
