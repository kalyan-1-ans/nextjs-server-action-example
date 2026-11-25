import { Suspense } from "react";
import { ProjectHeader } from "./_components/project-header";
import { ProjectNavigation } from "./_components/project-navigation";
import { ProjectNavigationSkeleton } from "./_components/project-skeletons";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <Suspense fallback={<ProjectNavigationSkeleton />}>
        <ProjectNavigation params={params} />
      </Suspense>
      <div className="min-w-0 flex-1 p-4 md:px-6">
        <ProjectHeader params={params} />
        {children}
      </div>
    </div>
  );
}
