import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { ServiceError } from "@/server/service-error";
import { assertProjectMember } from "./project.service";

type SprintInput = {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
};

type SprintTransition = {
  projectId: string;
  userId: string;
  sprintId: string;
};

export function getProjectSprints(projectId: string, userId: string) {
  return db.sprint.findMany({
    where: { projectId, project: { members: { some: { userId } } } },
    orderBy: { startDate: "asc" },
  });
}

export async function createSprint({
  projectId,
  userId,
  data,
}: {
  projectId: string;
  userId: string;
  data: SprintInput;
}) {
  await db.$transaction(async (tx) => {
    await assertProjectMember(tx, projectId, userId);

    await tx.sprint.create({ data: { ...data, projectId } });
  });
}

export async function startSprint({ projectId, userId, sprintId }: SprintTransition) {
  await db.$transaction(async (tx) => {
    await assertProjectMember(tx, projectId, userId);

    const sprint = await getProjectSprint(tx, projectId, sprintId);

    if (sprint.status !== "PLANNED") {
      throw new ServiceError("Only planned sprints can be started.");
    }

    if (await tx.sprint.count({ where: { projectId, status: "ACTIVE" } })) {
      throw new ServiceError("Complete the active sprint before starting another.");
    }

    if (!(await tx.issue.count({ where: { sprintId } }))) {
      throw new ServiceError("Add at least one issue before starting this sprint.");
    }

    await tx.sprint.update({ where: { id: sprintId }, data: { status: "ACTIVE" } });
  });
}

export async function completeSprint({ projectId, userId, sprintId }: SprintTransition) {
  await db.$transaction(async (tx) => {
    await assertProjectMember(tx, projectId, userId);

    const sprint = await getProjectSprint(tx, projectId, sprintId);

    if (sprint.status !== "ACTIVE") {
      throw new ServiceError("Only the active sprint can be completed.");
    }

    if (await tx.issue.count({ where: { sprintId, status: { not: "DONE" } } })) {
      throw new ServiceError(
        "Finish all issues, or move unfinished work to the backlog or a planned sprint, before completing this sprint.",
      );
    }

    await tx.sprint.update({ where: { id: sprintId }, data: { status: "COMPLETED" } });
  });
}

export async function assertSprintAcceptsIssues(
  tx: Prisma.TransactionClient,
  projectId: string,
  sprintId: string | null,
) {
  if (!sprintId) return;

  const sprint = await tx.sprint.findFirst({ where: { id: sprintId, projectId } });

  if (!sprint || sprint.status === "COMPLETED") {
    throw new ServiceError("Choose a planned or active sprint in this project.");
  }
}

async function getProjectSprint(tx: Prisma.TransactionClient, projectId: string, sprintId: string) {
  const sprint = await tx.sprint.findFirst({ where: { id: sprintId, projectId } });

  if (!sprint) throw new ServiceError("This sprint is no longer available.");

  return sprint;
}
