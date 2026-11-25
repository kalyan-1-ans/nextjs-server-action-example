import "server-only";

import { requireUser } from "@/lib/access";
import {
  getOwnedProjectsForUser,
  getAssociatedProjectsForUser,
} from "@/server/services/project.service";

export async function getWelcomeName() {
  const user = await requireUser();

  return user.name.split(" ")[0];
}

export async function getOwnedProjects() {
  const user = await requireUser();

  return getOwnedProjectsForUser(user.id);
}

export async function getAssociatedProjects() {
  const user = await requireUser();

  return getAssociatedProjectsForUser(user.id);
}
