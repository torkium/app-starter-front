import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "@/design-system/molecules/SearchField";

describe("SearchField", () => {
  it("keeps uncontrolled clear in sync through onValueChange", () => {
    const handleValueChange = vi.fn();
    render(<SearchField label="Recherche" defaultValue="projet" onValueChange={handleValueChange} onClear={() => undefined} />);

    fireEvent.click(screen.getByRole("button", { name: "Effacer la recherche" }));

    expect((screen.getByRole("searchbox", { name: "Recherche" }) as HTMLInputElement).value).toBe("");
    expect(handleValueChange).toHaveBeenCalledWith("");
    expect(document.activeElement).toBe(screen.getByRole("searchbox", { name: "Recherche" }));
  });

  it("delegates controlled changes to the parent", () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    render(<SearchField label="Recherche" value="projet" onChange={handleChange} onValueChange={handleValueChange} />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Recherche" }), { target: { value: "document" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("document");
  });

  it("clears through the controlled change path", () => {
    const handleValueChange = vi.fn();

    function ControlledSearchField() {
      const [search, setSearch] = useState("projet");

      return (
        <SearchField
          label="Recherche"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onValueChange={handleValueChange}
          onClear={() => undefined}
        />
      );
    }

    render(<ControlledSearchField />);

    fireEvent.click(screen.getByRole("button", { name: "Effacer la recherche" }));

    expect((screen.getByRole("searchbox", { name: "Recherche" }) as HTMLInputElement).value).toBe("");
    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("");
  });

  it("does not expose clear when the field cannot be edited", () => {
    const handleClear = vi.fn();
    const { rerender } = render(<SearchField label="Recherche" defaultValue="projet" onClear={handleClear} disabled />);

    expect(screen.queryByRole("button", { name: "Effacer la recherche" })).toBeNull();

    rerender(<SearchField label="Recherche" defaultValue="projet" onClear={handleClear} readOnly />);

    expect(screen.queryByRole("button", { name: "Effacer la recherche" })).toBeNull();
    expect(handleClear).not.toHaveBeenCalled();
  });
});
