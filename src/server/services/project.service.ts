import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
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

export function getOwnedProjectsForUser(userId: string) {
  return db.project.findMany({
    where: { ownerId: userId, members: { some: { userId } } },
    select: projectSummarySelect,
    orderBy: { id: "asc" },
  });
}

export function getAssociatedProjectsForUser(userId: string) {
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
