import "server-only";

import type { IssueStatus, IssueType, Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { ServiceError } from "@/server/service-error";
import { createAssignmentNotification } from "./notification.service";
import { assertProjectMember } from "./project.service";
import { assertSprintAcceptsIssues } from "./sprint.service";
import { assertProjectAssignee } from "./user.service";

type IssueInput = {
  summary: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  storyPoints: number;
  assigneeUserId: string | null;
  sprintId: string | null;
};

type MoveIssueInput = {
  id: string;
  sprintId: string | null;
  status: IssueStatus;
  beforeId?: string;
};

export function getProjectIssues(projectId: string, userId: string) {
  return db.issue.findMany({
    where: { projectId, project: { members: { some: { userId } } } },
    include: { assignee: { select: { name: true } }, reporter: { select: { name: true } } },
    orderBy: [{ orderIndex: "asc" }, { id: "asc" }],
  });
}

export async function saveIssue({
  projectId,
  userId,
  issueId,
  data,
}: {
  projectId: string;
  userId: string;
  issueId: string | null;
  data: IssueInput;
}) {
  await db.$transaction(async (tx) => {
    await assertProjectMember(tx, projectId, userId);
    await assertSprintAcceptsIssues(tx, projectId, data.sprintId);
    await assertProjectAssignee(tx, projectId, data.assigneeUserId);

    const previous = issueId ? await getEditableIssue(tx, projectId, issueId) : null;
    let issue;

    if (previous) {
      issue = await tx.issue.update({ where: { id: previous.id }, data });
    } else {
      const project = await tx.project.update({
        where: { id: projectId },
        data: { issueSequence: { increment: 1 } },
      });
      const last = await tx.issue.aggregate({ where: { projectId }, _max: { orderIndex: true } });

      issue = await tx.issue.create({
        data: {
          ...data,
          projectId,
          reporterUserId: userId,
          issueNumber: `${project.key}${project.issueSequence}`,
          orderIndex: (last._max.orderIndex ?? 0) + 1,
        },
      });
    }

    if (data.assigneeUserId && data.assigneeUserId !== previous?.assigneeUserId) {
      await createAssignmentNotification(tx, {
        userId: data.assigneeUserId,
        issueId: issue.id,
        issueNumber: issue.issueNumber,
      });
    }
  });
}

export async function deleteIssue({
  projectId,
  userId,
  issueId,
}: {
  projectId: string;
  userId: string;
  issueId: string;
}) {
  await db.$transaction(async (tx) => {
    await assertProjectMember(tx, projectId, userId);
    await getEditableIssue(tx, projectId, issueId);

    await tx.issue.delete({ where: { id: issueId } });
  });
}

export async function moveIssue({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: MoveIssueInput;
}) {
  await db.$transaction(async (tx) => {
    const { id, sprintId, status, beforeId } = data;

    await assertProjectMember(tx, projectId, userId);
    await getEditableIssue(tx, projectId, id);
    await assertSprintAcceptsIssues(tx, projectId, sprintId);

    const siblings = await tx.issue.findMany({
      where: { projectId, sprintId, status, id: { not: id } },
      select: { id: true },
      orderBy: [{ orderIndex: "asc" }, { id: "asc" }],
    });
    const beforeIndex = beforeId
      ? siblings.findIndex((issue) => issue.id === beforeId)
      : siblings.length;

    if (beforeIndex < 0) {
      throw new ServiceError("The destination changed. Try moving the issue again.");
    }

    siblings.splice(beforeIndex, 0, { id });

    await tx.issue.update({ where: { id }, data: { sprintId, status } });

    for (const [orderIndex, issue] of siblings.entries()) {
      await tx.issue.update({ where: { id: issue.id }, data: { orderIndex } });
    }
  });
}

async function getEditableIssue(tx: Prisma.TransactionClient, projectId: string, id: string) {
  const issue = await tx.issue.findFirst({
    where: { id, projectId },
    include: { sprint: { select: { status: true } } },
  });

  if (!issue) throw new ServiceError("This issue is no longer available.");

  if (issue.sprint?.status === "COMPLETED") {
    throw new ServiceError("Completed sprint issues are read-only.");
  }

  return issue;
}
