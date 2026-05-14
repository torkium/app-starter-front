import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Autocomplete, type AutocompleteOption } from "@/design-system/molecules/Autocomplete";

const options: AutocompleteOption[] = [
  { id: "alpha", textValue: "Projet Alpha", label: "Projet Alpha", description: "Application web", meta: "Actif" },
  { id: "billing", textValue: "Portail facturation", label: "Portail facturation", description: "Espace client", meta: "En revue" },
];
const alphaOption = options[0] as AutocompleteOption;

describe("Autocomplete", () => {
  it("renders suggestions before the minimum query length", () => {
    render(
      <Autocomplete
        label="Projet"
        minQueryLength={2}
        defaultOpen
        suggestions={[alphaOption]}
        options={options}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("option", { name: /Projet Alpha/i })).not.toBeNull();
    expect(screen.queryByRole("option", { name: /Portail/i })).toBeNull();
  });

  it("selects the active option with the keyboard", () => {
    const handleSelect = vi.fn();
    render(
      <Autocomplete
        label="Projet"
        defaultOpen
        options={options}
        onSelect={handleSelect}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Projet" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleSelect).toHaveBeenCalledWith(options[1]);
  });

  it("focus-opened ArrowDown keeps the first option active", () => {
    const handleSelect = vi.fn();
    render(<Autocomplete label="Projet" options={options} onSelect={handleSelect} />);

    const input = screen.getByRole("combobox", { name: "Projet" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(handleSelect).toHaveBeenCalledWith(options[0]);
  });

  it("keeps focus on the input when editing a selected option", () => {
    render(
      <Autocomplete
        label="Projet"
        selectedOption={alphaOption}
        options={options}
        onSelect={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Modifier/i }));

    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Projet" }));
  });

  it("closes the panel when focus leaves the autocomplete", async () => {
    render(
      <>
        <Autocomplete label="Projet" defaultOpen options={options} onSelect={() => undefined} />
        <button type="button">Après</button>
      </>,
    );

    const input = screen.getByRole("combobox", { name: "Projet" });
    fireEvent.focus(input);
    expect(screen.getByRole("listbox", { name: "Projet" })).not.toBeNull();

    fireEvent.blur(input);
    screen.getByRole("button", { name: "Après" }).focus();

    await waitFor(() => expect(screen.queryByRole("listbox", { name: "Projet" })).toBeNull());
  });

  it("closes the panel when focus leaves from the clear button", async () => {
    render(
      <>
        <Autocomplete label="Projet" defaultOpen defaultQuery="alpha" options={options} onSelect={() => undefined} />
        <button type="button">Après</button>
      </>,
    );

    const clearButton = screen.getByRole("button", { name: "Effacer la recherche" });
    fireEvent.focus(clearButton);
    expect(screen.getByRole("listbox", { name: "Projet" })).not.toBeNull();

    fireEvent.blur(clearButton, { relatedTarget: screen.getByRole("button", { name: "Après" }) });
    fireEvent.focus(screen.getByRole("button", { name: "Après" }));

    await waitFor(() => expect(screen.queryByRole("listbox", { name: "Projet" })).toBeNull());
  });

  it("does not expose editing actions when read-only", () => {
    const handleSelect = vi.fn();
    render(
      <Autocomplete
        label="Projet"
        defaultOpen
        defaultQuery="alpha"
        readOnly
        options={options}
        onSelect={handleSelect}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Projet" });
    expect(screen.queryByRole("button", { name: "Effacer la recherche" })).toBeNull();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.pointerDown(screen.getByRole("option", { name: "Projet Alpha" }));

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("keeps a selected read-only value reachable without advertising modification", () => {
    render(
      <Autocomplete
        label="Projet"
        selectedOption={alphaOption}
        readOnly
        options={options}
        onSelect={() => undefined}
      />,
    );

    const selectedButton = screen.getByRole("button", { name: "Projet, sélection actuelle : Projet Alpha. Lecture seule" });
    expect(selectedButton.hasAttribute("disabled")).toBe(false);
  });

  it("announces loading and error states when the panel is open", () => {
    const { rerender } = render(
      <Autocomplete
        label="Projet"
        query="por"
        onQueryChange={() => undefined}
        defaultOpen
        loading
        options={[]}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("status").textContent).toContain("Recherche en cours");

    rerender(
      <Autocomplete
        label="Projet"
        query="por"
        onQueryChange={() => undefined}
        defaultOpen
        error="Recherche indisponible"
        options={[]}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("Recherche indisponible");
  });

  it("uses textValue for rich option labels and submits the selected id in native forms", () => {
    const richOption: AutocompleteOption = {
      id: "rich",
      textValue: "Projet enrichi",
      label: <strong>Projet enrichi</strong>,
    };

    render(
      <form aria-label="Formulaire">
        <Autocomplete
          label="Projet"
          name="projectId"
          selectedOption={richOption}
          options={[richOption]}
          onSelect={() => undefined}
        />
      </form>,
    );

    expect(screen.getByRole("button", { name: /Projet enrichi/i })).not.toBeNull();
    expect(new FormData(screen.getByRole("form")).get("projectId")).toBe("rich");
  });

  it("uses textValue as the accessible option name", () => {
    const richOption: AutocompleteOption = {
      id: "rich",
      textValue: "Nom accessible",
      label: <strong aria-hidden="true">Label visuel</strong>,
    };

    render(<Autocomplete label="Projet" defaultOpen options={[richOption]} onSelect={() => undefined} />);

    expect(screen.getByRole("option", { name: "Nom accessible" })).not.toBeNull();
  });

  it("does not submit free text through the selection name", () => {
    render(
      <form aria-label="Formulaire">
        <Autocomplete
          label="Projet"
          name="projectId"
          defaultQuery="alpha"
          options={options}
          onSelect={() => undefined}
        />
      </form>,
    );

    expect(new FormData(screen.getByRole("form")).get("projectId")).toBeNull();
  });

  it("does not submit a stale selected id while editing", () => {
    render(
      <form aria-label="Formulaire">
        <Autocomplete
          label="Projet"
          name="projectId"
          selectedOption={alphaOption}
          options={options}
          onSelect={() => undefined}
        />
      </form>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Modifier/i }));
    fireEvent.change(screen.getByRole("combobox", { name: "Projet" }), { target: { value: "qui" } });

    expect(new FormData(screen.getByRole("form")).get("projectId")).toBeNull();
  });

  it("marks the visible combobox invalid when the async search has an error", () => {
    render(
      <Autocomplete
        label="Projet"
        error="Recherche indisponible"
        defaultOpen
        options={[]}
        onSelect={() => undefined}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Projet" }).getAttribute("aria-invalid")).toBe("true");
  });

  it("requires a selected option on the visible control", () => {
    const { unmount } = render(
      <form aria-label="Formulaire">
        <Autocomplete
          label="Projet"
          name="projectId"
          required
          options={options}
          onSelect={() => undefined}
        />
      </form>,
    );

    expect((screen.getByRole("combobox", { name: "Projet" }) as HTMLInputElement).validity.customError).toBe(true);

    unmount();

    render(
      <form aria-label="Formulaire">
        <Autocomplete
          label="Projet"
          name="projectId"
          required
          selectedOption={alphaOption}
          options={options}
          onSelect={() => undefined}
        />
      </form>,
    );

    expect((screen.getByRole("form") as HTMLFormElement).checkValidity()).toBe(true);
  });
});
