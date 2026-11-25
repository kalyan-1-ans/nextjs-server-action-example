import Link from "next/link";
import type { ProjectSummary } from "@/server/services/project.service";

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="mt-6 block w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm hover:border-gray-400"
    >
      <h3 className="mb-2 text-lg font-semibold">{project.name}</h3>
      <p className="text-base text-gray-600">{project.subTitle}</p>
      <div className="mt-2 flex items-center justify-end gap-1 text-sm">
        <span className="italic">Issue Count:</span>
        <span className="rounded-full bg-gray-200 px-2">{project._count.issues}</span>
      </div>
    </Link>
  );
}
