import { LayoutDashboard, List } from "lucide-react";

export function ProjectNavigationSkeleton() {
  return (
    <nav
      aria-label="Project"
      aria-busy="true"
      className="flex gap-1 bg-card p-2 md:min-h-[calc(100dvh-7rem)] md:w-52 md:shrink-0 md:flex-col md:border-r"
    >
      <span className="flex items-center gap-3 rounded-md p-3 text-sm text-muted-foreground">
        <LayoutDashboard className="size-5" />
        Active Sprint
      </span>
      <span className="flex items-center gap-3 rounded-md p-3 text-sm text-muted-foreground">
        <List className="size-5" />
        Issues
      </span>
    </nav>
  );
}

export function ProjectWorkspaceSkeleton({ board }: { board: boolean }) {
  return (
    <section aria-label="Loading project workspace" aria-busy="true">
      <h1 className="mb-6 text-2xl font-semibold">{board ? "Active Sprint" : "Issues"}</h1>
      <div className={board ? "grid gap-4 md:grid-cols-4" : "space-y-4"}>
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="h-36 animate-pulse rounded-lg border bg-muted/50" />
        ))}
      </div>
      <span className="sr-only">Loading issues and sprints…</span>
    </section>
  );
}
