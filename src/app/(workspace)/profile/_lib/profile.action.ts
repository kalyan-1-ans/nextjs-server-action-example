"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { updateUserProfile } from "@/server/services/user.service";
import { requireUser } from "@/lib/access";
import { profileSchema } from "@/lib/schemas";
import type { ActionResult, FormValues } from "@/lib/action-result";

export async function updateProfileAction(
  _previous: ActionResult,
  values: FormValues,
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await updateUserProfile(user.id, parsed.data);

  refresh();

  redirect("/dashboard");
}
