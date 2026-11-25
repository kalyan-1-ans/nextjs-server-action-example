import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { delayDatabaseRead } from "@/server/db-read-delay";

export async function getNotificationsForUser(userId: string) {
  await delayDatabaseRead();

  return db.notification.findMany({
    where: { userId, issue: { project: { members: { some: { userId } } } } },
    select: { id: true, message: true, read: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationRead(userId: string, notificationId: string) {
  await db.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function createAssignmentNotification(
  tx: Prisma.TransactionClient,
  { userId, issueId, issueNumber }: { userId: string; issueId: string; issueNumber: string },
) {
  await tx.notification.create({
    data: { userId, issueId, message: `${issueNumber} has been assigned to you.` },
  });
}
