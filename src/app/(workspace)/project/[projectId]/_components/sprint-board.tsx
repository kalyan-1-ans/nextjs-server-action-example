"use client";

import { statuses, statusLabels } from "@/lib/schemas";
import { IssueCard } from "./issue-card";
import type { IssueItem } from "../_lib/data";
import type { MoveInput } from "../_lib/schemas";

export function SprintBoard({
  issues,
  sprintId,
  pending,
  onEdit,
  onMove,
  onReorder,
}: {
  issues: IssueItem[];
  sprintId: string;
  pending: boolean;
  onEdit: (id: string) => void;
  onMove: (input: MoveInput) => void;
  onReorder: (issue: IssueItem, direction: number) => void;
}) {
  return (
    <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const column = issues.filter(
          (issue) => issue.sprintId === sprintId && issue.status === status,
        );

        return (
          // Cards can also be moved using the status field in the issue dialog.
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <section
            key={status}
            aria-label={statusLabels[status]}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onMove({ id: event.dataTransfer.getData("text/plain"), sprintId, status });
            }}
            className="min-h-80 min-w-60 flex-1 rounded-lg bg-gray-100 p-4"
          >
            <h2 className="mb-4 font-bold">
              {statusLabels[status]} <span className="text-gray-500">{column.length}</span>
            </h2>
            {column.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                board
                disabled={pending}
                onEdit={() => onEdit(issue.id)}
                onReorder={(direction) => onReorder(issue, direction)}
                onDrop={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  const id = event.dataTransfer.getData("text/plain");

                  if (id !== issue.id) onMove({ id, sprintId, status, beforeId: issue.id });
                }}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
