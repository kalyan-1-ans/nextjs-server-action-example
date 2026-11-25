import { Suspense } from "react";
import Link from "next/link";
import { getProjectDetails } from "../_lib/data";
import { ProjectRouteLabel } from "./project-route-label";

export function ProjectHeader({ params }: { params: Promise<{ projectId: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
      <Link href="/dashboard">Projects</Link>
      <span>/</span>
      <Suspense fallback={<span aria-busy="true">Loading project…</span>}>
        <ProjectName params={params} />
      </Suspense>
      <span>/</span>
      <Suspense fallback={<span aria-busy="true">…</span>}>
        <ProjectRouteLabel />
      </Suspense>
    </nav>
  );
}

async function ProjectName({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const { project } = await getProjectDetails(projectId);

  return <Link href={`/project/${project.id}`}>{project.name}</Link>;
}
