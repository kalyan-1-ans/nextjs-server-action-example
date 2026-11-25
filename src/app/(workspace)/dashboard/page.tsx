import { Suspense } from "react";
import { Welcome } from "./_components/welcome";
import { OwnedProjects, AssociatedProjects } from "./_components/project-sections";
import { WelcomeSkeleton, ProjectListSkeleton } from "./_components/dashboard-skeletons";

export const metadata = { title: "Projects" };

export default function Dashboard() {
  return (
    <section className="space-y-8 p-6 md:p-10 xl:px-24">
      <Suspense fallback={<WelcomeSkeleton />}>
        <Welcome />
      </Suspense>

      <section className="border-b pb-8">
        <h2 className="text-3xl font-semibold">Projects Owned by You</h2>
        <Suspense fallback={<ProjectListSkeleton />}>
          <OwnedProjects />
        </Suspense>
      </section>

      <section className="border-b pb-8">
        <h2 className="text-3xl font-semibold">Projects You Are Associated With</h2>
        <Suspense fallback={<ProjectListSkeleton />}>
          <AssociatedProjects />
        </Suspense>
      </section>
    </section>
  );
}
