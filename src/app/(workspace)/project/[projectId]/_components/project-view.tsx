import { getProjectData } from "../_lib/data";
import { ProjectHeader } from "./project-header";
import { ProjectNav } from "./project-nav";
import { IssueWorkspace } from "./issue-workspace";
import { Providers } from "@/components/providers";

export async function ProjectView({
  params,
  mode,
}: {
  params: Promise<{ projectId: string }>;
  mode: "backlog" | "board";
}) {
  const { projectId } = await params;
  const data = await getProjectData(projectId);
  const board = mode === "board";

  return (
    <div className="flex flex-col md:flex-row">
      <ProjectNav
        projectId={projectId}
        board={board}
        hasActive={data.sprints.some((sprint) => sprint.status === "ACTIVE")}
      />
      <div className="min-w-0 flex-1 p-4 md:px-6">
        <ProjectHeader project={data.project} board={board} />
        <Providers key={`${projectId}-${mode}`}>
          <IssueWorkspace data={data} board={board} />
        </Providers>
      </div>
    </div>
  );
}
