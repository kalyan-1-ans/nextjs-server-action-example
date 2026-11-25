import { getProjectNavigationData } from "../_lib/data";
import { ProjectNav } from "./project-nav";

export async function ProjectNavigation({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { hasActive } = await getProjectNavigationData(projectId);

  return <ProjectNav projectId={projectId} hasActive={hasActive} />;
}
