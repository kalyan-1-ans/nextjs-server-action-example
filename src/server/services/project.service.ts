import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { delayDatabaseRead } from "@/server/db-read-delay";
import { ServiceError } from "@/server/service-error";

export function getProjectForUser(projectId: string, userId: string) {
  return db.project.findFirst({
    where: { id: projectId, members: { some: { userId } } },
  });
}

const projectSummarySelect = {
  id: true,
  name: true,
  subTitle: true,
  _count: { select: { issues: true } },
} satisfies Prisma.ProjectSelect;

export async function getOwnedProjectsForUser(userId: string) {
  await delayDatabaseRead();

  return db.project.findMany({
    where: { ownerId: userId, members: { some: { userId } } },
    select: projectSummarySelect,
    orderBy: { id: "asc" },
  });
}

export async function getAssociatedProjectsForUser(userId: string) {
  await delayDatabaseRead();

  return db.project.findMany({
    where: { ownerId: { not: userId }, members: { some: { userId } } },
    select: projectSummarySelect,
    orderBy: { id: "asc" },
  });
}

export type ProjectSummary = Awaited<ReturnType<typeof getOwnedProjectsForUser>>[number];

export async function assertProjectMember(
  tx: Prisma.TransactionClient,
  projectId: string,
  userId: string,
) {
  const member = await tx.membership.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!member) throw new ServiceError("You do not have access to this project.");
}
