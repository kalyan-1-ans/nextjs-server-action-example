export function WelcomeSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading welcome message"
      className="mb-12 h-10 w-72 max-w-full rounded-lg bg-gray-200 motion-safe:animate-pulse"
    />
  );
}

export function ProjectListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading projects" className="flex flex-wrap gap-4">
      {[1, 2].map((id) => (
        <div
          key={id}
          className="mt-6 h-44 w-full max-w-sm rounded-xl border bg-card p-6 motion-safe:animate-pulse"
        >
          <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
          <div className="mb-2 h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
