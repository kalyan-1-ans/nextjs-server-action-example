"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/access";
import { markNotificationRead } from "@/server/services/notification.service";

export async function markReadAction(id: string) {
  const user = await requireUser();
  const notificationId = z.string().min(1).max(100).parse(id);

  await markNotificationRead(user.id, notificationId);

  refresh();
}
