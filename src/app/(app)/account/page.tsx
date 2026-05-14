import { redirect } from "next/navigation";
import { Card } from "@/design-system/molecules/Card";
import { Field } from "@/design-system/molecules/Field";
import { Section } from "@/design-system/organisms/Section";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
import { listConsents, listLegalDocuments, listSessions } from "@/domains/account/server/account.server";
import { getCurrentUser, requestEmailChange } from "@/infrastructure/auth/serverAuth";
import { getLocale } from "@/infrastructure/i18n/serverLocale";

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ emailChanged?: string; emailChangeRequested?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirect=/account");
  }

  const query = searchParams ? await searchParams : {};
  const locale = await getLocale();
  const [legalDocuments, consents, sessions] = await Promise.all([
    listLegalDocuments(locale),
    listConsents(),
    listSessions(),
  ]);

  async function submitEmailChange(formData: FormData): Promise<void> {
    "use server";

    const email = formData.get("email");
    if (typeof email !== "string" || email.trim() === "") {
      redirect("/account?emailChangeRequested=invalid");
    }

    await requestEmailChange({ email: email.trim() });
    redirect("/account?emailChangeRequested=success");
  }

  return (
    <Section
      eyebrow="Compte"
      title="Paramètres du compte"
      description="Gérez vos informations, vos consentements et les sessions connectées à My App."
      titleAs="h1"
    >
      <div style={gridStyle}>
        <Card title="Documents légaux" description={`${legalDocuments.length} document(s) actif(s)`}>
          <ul style={listStyle}>
            {legalDocuments.map((document) => (
              <li key={document.id}>
                <strong>{document.title}</strong>
                <div>{document.code} v{document.version}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Consentements" description={`${consents.length} consentement(s) enregistré(s)`}>
          <ul style={listStyle}>
            {consents.map((consent) => (
              <li key={`${consent.code}:${consent.version}`}>
                <strong>{consent.title}</strong>
                <div>{consent.code} v{consent.version}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Sessions" description={`${sessions.length} session(s) connues`}>
          <ul style={listStyle}>
            {sessions.map((session) => (
              <li key={session.id}>
                <strong>{session.deviceName ?? "Session sans nom"}</strong>
                <div>{session.isCurrent ? "Session courante" : "Session secondaire"}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Changer l’email" description="Recevez une confirmation avant de remplacer l’adresse associée à votre compte.">
          <form action={submitEmailChange} style={formStyle}>
            <Field label="Nouvelle adresse email" required>
              <Input id="email" name="email" type="email" defaultValue={user.email} required />
            </Field>
            <Button type="submit">
              Demander le changement
            </Button>
            {query.emailChangeRequested === "success" ? <p style={successStyle}>Email de confirmation envoyé.</p> : null}
            {query.emailChangeRequested === "invalid" ? <p style={errorStyle}>Adresse email invalide.</p> : null}
            {query.emailChanged === "success" ? <p style={successStyle}>Adresse email mise à jour.</p> : null}
          </form>
        </Card>
      </div>
    </Section>
  );
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: "1rem",
  display: "grid",
  gap: ".6rem",
};

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: ".75rem",
};

const successStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--success)",
  fontSize: ".95rem",
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--danger)",
  fontSize: ".95rem",
};
