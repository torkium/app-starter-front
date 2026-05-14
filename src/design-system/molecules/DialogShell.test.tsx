import { fireEvent, render, screen, within } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/design-system/primitives/atoms/Button";
import { DialogShell } from "@/design-system/molecules/DialogShell";

describe("DialogShell", () => {
  it("closes on Escape and keeps focus inside with Tab", () => {
    const handleClose = vi.fn();
    render(
      <DialogShell
        open
        title="Modifier l’élément"
        onClose={handleClose}
        footer={<Button>Enregistrer</Button>}
      >
        <Button>Premier champ</Button>
      </DialogShell>,
    );

    const closeButton = screen.getByRole("button", { name: "Fermer la fenêtre" });
    const saveButton = screen.getByRole("button", { name: "Enregistrer" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(saveButton);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not steal focus on parent rerender with a new onClose callback", () => {
    const { rerender } = render(
      <DialogShell open title="Modifier l’élément" onClose={() => undefined}>
        <input aria-label="Nom" />
      </DialogShell>,
    );

    const input = screen.getByRole("textbox", { name: "Nom" });
    input.focus();

    rerender(
      <DialogShell open title="Modifier l’élément" onClose={() => undefined}>
        <input aria-label="Nom" />
      </DialogShell>,
    );

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Nom" }));
  });

  it("supports alertdialog role and custom initial focus", () => {
    function AlertDialogStory() {
      const cancelRef = useRef<HTMLButtonElement>(null);

      return (
        <DialogShell
          open
          role="alertdialog"
          title="Supprimer l’élément"
          description="Cette action supprimera définitivement l’élément."
          onClose={() => undefined}
          initialFocusRef={cancelRef}
          footer={<Button>Supprimer</Button>}
        >
          <p>Les éléments liés resteront dans l&apos;historique.</p>
          <Button ref={cancelRef}>Annuler</Button>
        </DialogShell>
      );
    }

    render(<AlertDialogStory />);

    const dialog = screen.getByRole("alertdialog", { name: "Supprimer l’élément" });
    const descriptionId = dialog.getAttribute("aria-describedby");
    expect(descriptionId).toBeTruthy();
    expect(document.getElementById(descriptionId as string)?.textContent).toContain("Cette action supprimera définitivement l’élément.");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Annuler" }));
  });

  it("does not describe alertdialog with arbitrary body content", () => {
    render(
      <DialogShell open role="alertdialog" title="Supprimer l’élément" onClose={() => undefined}>
        <p>Texte riche.</p>
        <Button>Confirmer</Button>
      </DialogShell>,
    );

    expect(screen.getByRole("alertdialog", { name: "Supprimer l’élément" }).getAttribute("aria-describedby")).toBeNull();
  });

  it("does not close when Escape was already handled inside the dialog", () => {
    const handleClose = vi.fn();
    render(
      <DialogShell open title="Modifier l’élément" onClose={handleClose}>
        <Button>Action interne</Button>
      </DialogShell>,
    );

    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it("does not keep closed dialog portals in the document", () => {
    const { rerender } = render(
      <>
        <DialogShell open title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open={false} title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    expect(document.querySelectorAll("[data-dialog-shell-portal]")).toHaveLength(1);

    rerender(
      <>
        <DialogShell open title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    expect(screen.getByRole("dialog", { name: "Child" }).closest("[data-dialog-shell-portal]")?.hasAttribute("inert")).toBe(false);
  });

  it("lets the topmost dialog own Escape and focus trapping", () => {
    const handleParentClose = vi.fn();
    const handleChildClose = vi.fn();
    render(
      <>
        <DialogShell open title="Parent" onClose={handleParentClose}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open title="Child" onClose={handleChildClose}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleParentClose).not.toHaveBeenCalled();
    expect(handleChildClose).toHaveBeenCalledTimes(1);

    const parentAction = screen.getByText("Parent action").closest("button") as HTMLButtonElement;
    parentAction.focus();

    expect(document.activeElement).toBe(
      within(screen.getByRole("dialog", { name: "Child" })).getByRole("button", { name: "Fermer la fenêtre" }),
    );
  });

  it("keeps the document protected if a lower dialog closes before the topmost one", () => {
    const { rerender } = render(
      <>
        <main data-testid="app-root">
          <Button>Ouvrir l’élément</Button>
        </main>
        <DialogShell open={false} title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open={false} title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );
    const opener = screen.getByRole("button", { name: "Ouvrir l’élément" });
    opener.focus();

    rerender(
      <>
        <main data-testid="app-root">
          <Button>Ouvrir l’élément</Button>
        </main>
        <DialogShell open title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    const appContainer = screen.getByTestId("app-root").parentElement as HTMLElement;
    expect(appContainer.getAttribute("aria-hidden")).toBe("true");
    expect(appContainer.inert).toBe(true);

    rerender(
      <>
        <main data-testid="app-root">
          <Button>Ouvrir l’élément</Button>
        </main>
        <DialogShell open={false} title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    const protectedAppContainer = screen.getByTestId("app-root").parentElement as HTMLElement;
    expect(protectedAppContainer.getAttribute("aria-hidden")).toBe("true");
    expect(protectedAppContainer.inert).toBe(true);

    rerender(
      <>
        <main data-testid="app-root">
          <Button>Ouvrir l’élément</Button>
        </main>
        <DialogShell open={false} title="Parent" onClose={() => undefined}>
          <Button>Parent action</Button>
        </DialogShell>
        <DialogShell open={false} title="Child" onClose={() => undefined}>
          <Button>Child action</Button>
        </DialogShell>
      </>,
    );

    const restoredAppContainer = screen.getByTestId("app-root").parentElement as HTMLElement;
    expect(restoredAppContainer.getAttribute("aria-hidden")).toBeNull();
    expect(restoredAppContainer.inert).toBe(false);
    expect(document.activeElement?.textContent).toBe(opener.textContent);
  });
});
