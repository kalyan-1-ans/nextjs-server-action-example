"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireProject } from "@/lib/access";
import type { ActionResult, FormValues } from "@/lib/action-result";
import { ServiceError } from "@/server/service-error";
import { createSprint, startSprint, completeSprint } from "@/server/services/sprint.service";
import { sprintSchema } from "./schemas";

export async function createSprintAction(
  projectId: string,
  _previous: ActionResult,
  values: FormValues,
): Promise<ActionResult> {
  const parsed = sprintSchema.safeParse(values);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { user } = await requireProject(projectId);

  try {
    await createSprint({ projectId, userId: user.id, data: parsed.data });
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };

    throw error;
  }

  refresh();

  return { ok: true };
}

export async function transitionSprintAction(
  projectId: string,
  sprintId: string,
  transition: "start" | "complete",
): Promise<ActionResult> {
  z.string().min(1).max(100).parse(sprintId);
  z.enum(["start", "complete"]).parse(transition);

  const { user } = await requireProject(projectId);
  const input = { projectId, userId: user.id, sprintId };

  try {
    if (transition === "start") {
      await startSprint(input);
    } else {
      await completeSprint(input);
    }
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };

    throw error;
  }

  refresh();

  return { ok: true };
}
