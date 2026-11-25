import { Suspense } from "react";
import { WorkspaceHeader, WorkspaceHeaderSkeleton } from "./_components/workspace-header";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only z-50 bg-card p-3 focus:not-sr-only focus:fixed">
        Skip to content
      </a>
      <Suspense fallback={<WorkspaceHeaderSkeleton />}>
        <WorkspaceHeader />
      </Suspense>
      <main id="main-content" className="min-w-0">
        {children}
      </main>
    </>
  );
}
