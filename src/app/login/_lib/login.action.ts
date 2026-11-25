"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/lib/schemas";
import type { ActionResult, FormValues } from "@/lib/action-result";

export async function loginAction(
  _previous: ActionResult,
  values: FormValues,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) return { error: "Enter a username and password." };

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Invalid username or password." };

    throw error;
  }

  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
