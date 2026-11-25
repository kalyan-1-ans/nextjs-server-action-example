import "server-only";

import { cache } from "react";
import { requireProject } from "@/lib/access";
import { getProjectIssues } from "@/server/services/issue.service";
import { getProjectSprints } from "@/server/services/sprint.service";
import { getProjectMembers } from "@/server/services/user.service";

export const getProjectDetails = cache(requireProject);

const getSprints = cache(getProjectSprints);

export async function getProjectNavigationData(projectId: string) {
  const { user } = await getProjectDetails(projectId);
  const sprints = await getSprints(projectId, user.id);

  return { hasActive: sprints.some((sprint) => sprint.status === "ACTIVE") };
}

export async function getProjectData(projectId: string) {
  const { project, user } = await getProjectDetails(projectId);
  const [issues, sprints, users] = await Promise.all([
    getProjectIssues(projectId, user.id),
    getSprints(projectId, user.id),
    getProjectMembers(projectId, user.id),
  ]);

  return { project, user, issues, sprints, users };
}

export type ProjectData = Awaited<ReturnType<typeof getProjectData>>;

export type IssueItem = ProjectData["issues"][number];
