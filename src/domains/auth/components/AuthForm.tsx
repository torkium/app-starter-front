"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/design-system/components/Button";
import { Field } from "@/design-system/components/Field";
import { FormCard } from "@/design-system/components/FormCard";
import { Input } from "@/design-system/components/Input";
import { Notice } from "@/design-system/components/Notice";
import { INITIAL_AUTH_ACTION_STATE, type AuthActionState } from "@/domains/auth/actionState";

export interface AuthField {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Traitement..." : label}
    </Button>
  );
}

export function AuthForm({
  title,
  description,
  submitLabel,
  fields,
  action,
  footer,
  hiddenFields,
}: {
  title: string;
  description: string;
  submitLabel: string;
  fields: AuthField[];
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  footer?: React.ReactNode;
  hiddenFields?: Array<{ name: string; value: string }>;
}) {
  const [state, formAction] = useActionState(action, INITIAL_AUTH_ACTION_STATE);

  return (
    <FormCard title={title} description={description} footer={footer}>
      <form action={formAction} style={{ display: "grid", gap: "1rem" }}>
        {state.error ? (
          <Notice tone="danger">
            <strong>Action refusée.</strong> {state.error}
            {state.requestId ? <span style={{ display: "block", marginTop: ".4rem" }}>Référence: {state.requestId}</span> : null}
          </Notice>
        ) : null}
        {hiddenFields?.map((field) => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
        {fields.map((field) => (
          <Field key={field.name} label={field.label} hint={field.hint}>
            <Input
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              required={field.required ?? true}
            />
          </Field>
        ))}
        <SubmitButton label={submitLabel} />
      </form>
    </FormCard>
  );
}
