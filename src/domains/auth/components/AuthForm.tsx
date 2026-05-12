"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Field } from "@/design-system/molecules/Field";
import { FormCard } from "@/design-system/molecules/FormCard";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Input } from "@/design-system/primitives/atoms/Input";
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
    <Button type="submit" loading={pending}>
      {label}
    </Button>
  );
}

export function AuthForm({
  title,
  description,
  submitLabel,
  fields,
  action,
  notice,
  footer,
  hiddenFields,
}: {
  title: string;
  description: string;
  submitLabel: string;
  fields: AuthField[];
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  notice?: React.ReactNode;
  footer?: React.ReactNode;
  hiddenFields?: Array<{ name: string; value: string }>;
}) {
  const [state, formAction] = useActionState(action, INITIAL_AUTH_ACTION_STATE);

  return (
    <FormCard title={title} description={description} footer={footer}>
      <form action={formAction} style={{ display: "grid", gap: "1rem" }}>
        {notice}
        {state.error ? (
          <Notice tone="danger">
            <strong>Action refusée.</strong> {state.error}
            {state.requestId ? <span style={{ display: "block", marginTop: ".4rem" }}>Référence: {state.requestId}</span> : null}
          </Notice>
        ) : null}
        {hiddenFields?.map((field) => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
        {fields.map((field) => (
          <Field key={field.name} label={field.label} hint={field.hint} required={field.required ?? true}>
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
