import { ProjectWorkspace } from "./_components/project-workspace";

export const metadata = { title: "Issues" };

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  return <ProjectWorkspace params={params} mode="backlog" />;
}
