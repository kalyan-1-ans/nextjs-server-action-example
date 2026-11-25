"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireProject } from "@/lib/access";
import type { ActionResult, FormValues } from "@/lib/action-result";
import { ServiceError } from "@/server/service-error";
import { saveIssue, deleteIssue, moveIssue } from "@/server/services/issue.service";
import { issueSchema, moveSchema, type MoveInput } from "./schemas";

export async function saveIssueAction(
  projectId: string,
  id: string | null,
  _previous: ActionResult,
  values: FormValues,
): Promise<ActionResult> {
  const parsed = issueSchema.safeParse(values);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { user } = await requireProject(projectId);
  const data = {
    ...parsed.data,
    storyPoints: Number(parsed.data.storyPoints),
    sprintId: parsed.data.sprintId || null,
    assigneeUserId: parsed.data.assigneeUserId || null,
  };

  try {
    await saveIssue({ projectId, userId: user.id, issueId: id, data });
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };

    throw error;
  }

  refresh();

  return { ok: true };
}

export async function deleteIssueAction(projectId: string, id: string): Promise<ActionResult> {
  z.string().min(1).max(100).parse(id);

  const { user } = await requireProject(projectId);

  try {
    await deleteIssue({ projectId, userId: user.id, issueId: id });
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };

    throw error;
  }

  refresh();

  return { ok: true };
}

export async function moveIssueAction(projectId: string, input: MoveInput): Promise<ActionResult> {
  const parsed = moveSchema.safeParse(input);

  if (!parsed.success) return { error: "Invalid issue move." };

  const { user } = await requireProject(projectId);
  const data = { ...parsed.data, sprintId: parsed.data.sprintId || null };

  try {
    await moveIssue({ projectId, userId: user.id, data });
  } catch (error) {
    if (error instanceof ServiceError) return { error: error.message };

    throw error;
  }

  refresh();

  return { ok: true };
}
