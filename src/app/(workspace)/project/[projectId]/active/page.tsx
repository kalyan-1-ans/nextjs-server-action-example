import { ProjectView } from "../_components/project-view";

export const metadata = { title: "Active sprint" };

export default function Page({ params }: { params: Promise<{ projectId: string }> }) {
  return <ProjectView params={params} mode="board" />;
}
