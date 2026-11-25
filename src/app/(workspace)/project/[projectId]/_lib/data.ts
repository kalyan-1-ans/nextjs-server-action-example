import "server-only";

import { requireProject } from "@/lib/access";
import { getProjectIssues } from "@/server/services/issue.service";
import { getProjectSprints } from "@/server/services/sprint.service";
import { getProjectMembers } from "@/server/services/user.service";

export async function getProjectData(projectId: string) {
  const { project, user } = await requireProject(projectId);
  const [issues, sprints, users] = await Promise.all([
    getProjectIssues(projectId, user.id),
    getProjectSprints(projectId, user.id),
    getProjectMembers(projectId, user.id),
  ]);

  return { project, user, issues, sprints, users };
}

export type ProjectData = Awaited<ReturnType<typeof getProjectData>>;

export type IssueItem = ProjectData["issues"][number];
