"use client";

import { Bug, Bookmark } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels } from "@/lib/schemas";
import type { IssueItem } from "../_lib/data";

export function IssueCard({
  issue,
  board = false,
  disabled,
  onEdit,
  onDrop,
  onReorder,
}: {
  issue: IssueItem;
  board?: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDrop: (event: React.DragEvent) => void;
  onReorder: (direction: number) => void;
}) {
  const Icon = issue.type === "BUG" ? Bug : Bookmark;

  return (
    <div
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", issue.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(event) => {
        if (!disabled) event.preventDefault();
      }}
      onDrop={(event) => {
        if (!disabled) onDrop(event);
      }}
      className={cn(
        board
          ? "mb-3 rounded-lg border bg-card p-4 shadow-sm"
          : "flex flex-wrap items-center gap-3 border-b border-gray-400 py-4 last:border-0",
      )}
    >
      <div className={cn("flex min-w-0 flex-1 items-center gap-3", board && "mb-4")}>
        <Icon
          className={cn(
            "size-4 shrink-0",
            issue.type === "BUG" ? "text-red-600" : "text-green-700",
          )}
        />
        <span className="shrink-0 text-xs text-gray-600">{issue.issueNumber}</span>
        <button
          disabled={disabled}
          onClick={onEdit}
          onKeyDown={(event) => {
            if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
              event.preventDefault();
              onReorder(event.key === "ArrowUp" ? -1 : 1);
            }
          }}
          aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
          title="Open issue. Alt+Up or Alt+Down to reorder."
          className="text-left text-sm hover:underline disabled:cursor-default disabled:no-underline"
        >
          {issue.summary}
        </button>
      </div>
      <div className="flex items-center justify-end gap-3">
        {!board ? <Badge variant="secondary">{statusLabels[issue.status]}</Badge> : null}
        <span className="rounded bg-gray-300 px-2 py-0.5 text-xs">{issue.storyPoints}</span>
        <Avatar name={issue.assignee?.name ?? "Unassigned"} className="size-6" />
      </div>
    </div>
  );
}
