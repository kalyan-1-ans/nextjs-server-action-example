import { ProjectWorkspace } from "../_components/project-workspace";

export const metadata = { title: "Active sprint" };

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  return <ProjectWorkspace params={params} mode="board" />;
}
