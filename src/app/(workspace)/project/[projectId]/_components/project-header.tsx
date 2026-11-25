import Link from "next/link";

export function ProjectHeader({
  project,
  board,
}: {
  project: { id: string; name: string };
  board: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
      <Link href="/dashboard">Projects</Link>
      <span>/</span>
      <Link href={`/project/${project.id}`}>{project.name}</Link>
      <span>/</span>
      <span>{board ? "Active Sprint" : "Issues"}</span>
    </nav>
  );
}
