"use client";

import type { Route } from "next";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { AuthPanel } from "@/design-system/molecules/AuthPanel";
import { Field } from "@/design-system/molecules/Field";
import { Notice } from "@/design-system/molecules/Notice";
import { Button } from "@/design-system/primitives/atoms/Button";
import { Checkbox } from "@/design-system/primitives/atoms/Checkbox";
import { Input } from "@/design-system/primitives/atoms/Input";
import { INITIAL_AUTH_ACTION_STATE, type AuthActionState } from "@/domains/auth/actionState";

export interface AuthField {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  autoComplete?: string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
}

export interface AuthFooterLink {
  href: Route;
  label: string;
  prefix?: string;
}

export interface AuthLegalCheck {
  name: string;
  label: React.ReactNode;
  required?: boolean;
}

type AuthLiveValidationMode = "register";

type FieldFeedback = {
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={pending} fullWidth size="lg">
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
  footerLinks,
  hiddenFields,
  legalChecks,
  liveValidation,
}: {
  title: string;
  description: string;
  submitLabel: string;
  fields: AuthField[];
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  notice?: React.ReactNode;
  footer?: React.ReactNode;
  footerLinks?: AuthFooterLink[];
  hiddenFields?: Array<{ name: string; value: string }>;
  legalChecks?: AuthLegalCheck[];
  liveValidation?: AuthLiveValidationMode;
}) {
  const [state, formAction] = useActionState(action, INITIAL_AUTH_ACTION_STATE);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [blurredFields, setBlurredFields] = useState<ReadonlySet<string>>(() => new Set());
  const fieldFeedback = useMemo(
    () => getFieldFeedback(liveValidation, fieldValues, blurredFields, fields),
    [blurredFields, fieldValues, fields, liveValidation],
  );
  const resolvedFooter = footerLinks ? (
    <>
      {footerLinks.map((link) => (
        <span key={link.href}>
          {link.prefix ? `${link.prefix} ` : null}
          <Link href={link.href}>{link.label}</Link>
        </span>
      ))}
    </>
  ) : footer;

  return (
    <AuthPanel title={title} description={description} footer={resolvedFooter}>
      <form action={formAction} className="ui-auth-panel__form">
        {notice}
        {state.error ? (
          <Notice tone="danger">
            <strong>Action refusée.</strong> {state.error}
            {state.requestId ? <span style={{ display: "block", marginTop: ".4rem" }}>Référence: {state.requestId}</span> : null}
          </Notice>
        ) : null}
        {hiddenFields?.map((field) => <input key={field.name} type="hidden" name={field.name} value={field.value} />)}
        {fields.map((field) => {
          const feedback = fieldFeedback[field.name];

          return (
            <Field
              key={field.name}
              label={field.label}
              hint={field.hint}
              error={feedback?.message}
              required={field.required ?? true}
            >
              <Input
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                defaultValue={field.defaultValue}
                minLength={field.minLength}
                maxLength={field.maxLength}
                required={field.required ?? true}
                placeholder={field.label}
                controlSize="lg"
                onChange={(event) => {
                  const { value } = event.currentTarget;
                  setFieldValues((current) => ({ ...current, [field.name]: value }));
                }}
                onBlur={(event) => {
                  const { value } = event.currentTarget;
                  setFieldValues((current) => ({ ...current, [field.name]: value }));
                  setBlurredFields((current) => new Set(current).add(field.name));
                }}
              />
            </Field>
          );
        })}
        {legalChecks?.length ? (
          <div className="ui-auth-legal">
            {legalChecks.map((check) => (
              <div key={check.name} className="ui-auth-legal__item">
                <Checkbox
                  id={`auth-${check.name}`}
                  name={check.name}
                  required={check.required ?? true}
                  aria-labelledby={`auth-${check.name}-label`}
                />
                <span id={`auth-${check.name}-label`}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <SubmitButton label={submitLabel} />
      </form>
    </AuthPanel>
  );
}

function getFieldFeedback(
  mode: AuthLiveValidationMode | undefined,
  values: Record<string, string>,
  blurredFields: ReadonlySet<string>,
  fields: AuthField[],
): Record<string, FieldFeedback | undefined> {
  if (mode !== "register") {
    return {};
  }

  const passwordField = fields.find((field) => field.name === "password");
  const email = values.email?.trim() ?? "";
  const password = values.password ?? "";
  const confirmPassword = values.confirmPassword ?? "";
  const minimumPasswordLength = passwordField?.minLength ?? 12;
  const feedback: Record<string, FieldFeedback | undefined> = {};

  if (blurredFields.has("email") && email.length > 0) {
    feedback.email = EMAIL_PATTERN.test(email)
      ? undefined
      : { message: "Adresse email invalide." };
  }

  if (blurredFields.has("password") && password.length > 0 && password.length < minimumPasswordLength) {
    feedback.password = { message: `Au moins ${minimumPasswordLength} caractères.` };
  }

  if (blurredFields.has("confirmPassword") && confirmPassword.length > 0 && password !== confirmPassword) {
    feedback.confirmPassword = { message: "Les mots de passe ne correspondent pas." };
  }

  return feedback;
}
