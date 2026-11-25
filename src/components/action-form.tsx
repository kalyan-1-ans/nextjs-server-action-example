"use client";

import { useActionState, useEffect, useId, startTransition } from "react";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import type { FormAction, FormValues, ActionResult } from "@/lib/action-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type FieldConfig = {
  name: string;
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
  wide?: boolean;
  disabled?: boolean;
};

const initial: ActionResult = {};

export function ActionForm({
  action,
  defaults,
  schema,
  fields,
  submitLabel = "Save changes",
  onSuccess,
  children,
}: {
  action: FormAction;
  defaults: FormValues;
  schema: z.ZodType<FormValues, FormValues>;
  fields: FieldConfig[];
  submitLabel?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
}) {
  const [result, submitAction, pending] = useActionState(action, initial);
  const id = useId();

  useEffect(() => {
    if (result.ok) onSuccess?.();
  }, [result, onSuccess]);

  const form = useForm({
    defaultValues: defaults,
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => {
      startTransition(() => submitAction(value));
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="space-y-5"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((config) => (
          <form.Field key={config.name} name={config.name}>
            {(field) => {
              const fieldId = `${id}-${field.name}`;
              const invalid = field.state.meta.errors.length > 0;
              const props = {
                id: fieldId,
                name: field.name,
                value: field.state.value ?? "",
                onBlur: field.handleBlur,
                onChange: (
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                  >,
                ) => field.handleChange(event.target.value),
                "aria-invalid": invalid,
                "aria-describedby": invalid ? `${fieldId}-error` : undefined,
                disabled: pending || config.disabled,
              };

              return (
                <div className={config.wide ? "sm:col-span-2" : ""}>
                  <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium">
                    {config.label}
                  </label>
                  {config.options ? (
                    <select
                      {...props}
                      className="h-10 w-full rounded-lg border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {config.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : config.type === "textarea" ? (
                    <textarea
                      {...props}
                      rows={3}
                      className="w-full rounded-lg border bg-card p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  ) : (
                    <Input
                      {...props}
                      type={config.type ?? "text"}
                      autoComplete={
                        config.name === "password"
                          ? "current-password"
                          : config.name === "username"
                            ? "username"
                            : undefined
                      }
                    />
                  )}
                  {invalid ? (
                    <p id={`${fieldId}-error`} className="mt-1 text-xs text-destructive">
                      {field.state.meta.errors
                        .map((error) => (typeof error === "string" ? error : error?.message))
                        .join(", ")}
                    </p>
                  ) : null}
                </div>
              );
            }}
          </form.Field>
        ))}
      </div>
      {result.error ? (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-destructive">
          {result.error}
        </p>
      ) : null}
      {result.ok && result.message ? (
        <output className="block text-sm text-emerald-700">{result.message}</output>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        {children}
        <Button type="submit" disabled={pending} className="ml-auto">
          {pending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
