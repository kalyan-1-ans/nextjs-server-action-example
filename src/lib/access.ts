import "server-only";

import { connection } from "next/server";
import { z } from "zod";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/server/services/user.service";
import { getProjectForUser } from "@/server/services/project.service";

export const requireUser = cache(async () => {
  // Auth.js may generate a CSRF token before reading cookies. Defer all auth work.
  await connection();

  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);

  if (!user) redirect("/login");

  return user;
});

export async function requireProject(projectId: string) {
  z.string().min(1).max(100).parse(projectId);

  const user = await requireUser();
  const project = await getProjectForUser(projectId, user.id);

  if (!project) notFound();

  return { user, project };
}
