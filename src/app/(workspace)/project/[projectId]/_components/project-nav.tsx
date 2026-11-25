import Link from "next/link";
import { LayoutDashboard, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectNav({
  projectId,
  board,
  hasActive,
}: {
  projectId: string;
  board: boolean;
  hasActive: boolean;
}) {
  const itemClass = "flex items-center gap-3 rounded-md p-3 text-sm hover:bg-gray-100";

  return (
    <nav
      aria-label="Project"
      className="flex gap-1 bg-card p-2 md:min-h-[calc(100dvh-7rem)] md:w-52 md:shrink-0 md:flex-col md:border-r"
    >
      {hasActive ? (
        <Link
          href={`/project/${projectId}/active`}
          aria-current={board ? "page" : undefined}
          className={cn(itemClass, board && "bg-gray-200")}
        >
          <LayoutDashboard className="size-5" />
          Active Sprint
        </Link>
      ) : (
        <span aria-disabled="true" className={cn(itemClass, "cursor-not-allowed opacity-40")}>
          <LayoutDashboard className="size-5" />
          Active Sprint
        </span>
      )}
      <Link
        href={`/project/${projectId}`}
        aria-current={!board ? "page" : undefined}
        className={cn(itemClass, !board && "bg-gray-200")}
      >
        <List className="size-5" />
        Issues
      </Link>
    </nav>
  );
}
