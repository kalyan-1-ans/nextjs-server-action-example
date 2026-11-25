import type { ProjectSummary } from "@/server/services/project.service";
import { getOwnedProjects, getAssociatedProjects } from "../_lib/data";
import { ProjectCard } from "./project-card";

export async function OwnedProjects() {
  const projects = await getOwnedProjects();

  return <ProjectList projects={projects} />;
}

export async function AssociatedProjects() {
  const projects = await getAssociatedProjects();

  return <ProjectList projects={projects} />;
}

function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  if (!projects.length) return <p className="mt-4 text-gray-600">No projects found.</p>;

  return (
    <div className="flex flex-wrap gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
