export function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading workspace" className="space-y-5 p-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((id) => (
          <div key={id} className="h-36 animate-pulse rounded-xl border bg-muted/50" />
        ))}
      </div>
      <span className="sr-only">Loading workspace…</span>
    </div>
  );
}
