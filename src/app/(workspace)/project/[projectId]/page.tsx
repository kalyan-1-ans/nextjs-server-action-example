import { ProjectView } from "./_components/project-view";

export const metadata = { title: "Issues" };

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  return <ProjectView params={params} mode="backlog" />;
}
