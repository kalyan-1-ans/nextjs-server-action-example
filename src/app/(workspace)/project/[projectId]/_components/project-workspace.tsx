import { Providers } from "@/components/providers";
import { getProjectData } from "../_lib/data";
import { IssueWorkspace } from "./issue-workspace";

export async function ProjectWorkspace({
  params,
  mode,
}: {
  params: Promise<{ projectId: string }>;
  mode: "backlog" | "board";
}) {
  const { projectId } = await params;
  const data = await getProjectData(projectId);

  return (
    <Providers key={`${projectId}-${mode}`}>
      <IssueWorkspace data={data} board={mode === "board"} />
    </Providers>
  );
}
