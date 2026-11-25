import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { verifyPassword } from "@/lib/password";
import { db } from "@/server/db";
import { ServiceError } from "@/server/service-error";

export async function authenticateUser(username: string, password: string) {
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    select: { id: true, name: true, email: true, passwordHash: true },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) return null;

  return { id: user.id, name: user.name, email: user.email };
}

export function getUserById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, username: true },
  });
}

export async function updateUserProfile(userId: string, data: { name: string }) {
  await db.user.update({
    where: { id: userId },
    data,
    select: { id: true },
  });
}

export async function getProjectMembers(projectId: string, userId: string) {
  const memberships = await db.membership.findMany({
    where: { projectId, project: { members: { some: { userId } } } },
    select: { user: { select: { id: true, name: true } } },
    orderBy: { user: { name: "asc" } },
  });

  return memberships.map((member) => member.user);
}

export async function assertProjectAssignee(
  tx: Prisma.TransactionClient,
  projectId: string,
  userId: string | null,
) {
  if (!userId) return;

  const member = await tx.membership.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!member) throw new ServiceError("Choose a teammate from this project.");
}
