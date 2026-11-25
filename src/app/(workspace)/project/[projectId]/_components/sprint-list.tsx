"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IssueCard } from "./issue-card";
import type { IssueItem, ProjectData } from "../_lib/data";
import type { MoveInput } from "../_lib/schemas";

export function SprintList({
  issues,
  sprints,
  pending,
  onEdit,
  onTransition,
  onMove,
  onReorder,
}: {
  issues: IssueItem[];
  sprints: ProjectData["sprints"];
  pending: boolean;
  onEdit: (id: string) => void;
  onTransition: (id: string, transition: "start" | "complete") => void;
  onMove: (input: MoveInput) => void;
  onReorder: (issue: IssueItem, direction: number) => void;
}) {
  const groups = [
    ...sprints.filter((sprint) => sprint.status !== "COMPLETED"),
    null,
    ...sprints.filter((sprint) => sprint.status === "COMPLETED"),
  ];

  return (
    <div className="space-y-12">
      {groups.map((sprint) => {
        const groupIssues = issues.filter((issue) => issue.sprintId === (sprint?.id ?? null));
        const completed = sprint?.status === "COMPLETED";

        return (
          <section
            key={sprint?.id ?? "backlog"}
            className={`bg-gray-200 p-4 ${completed ? "text-gray-500" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <h2 className="font-semibold">{sprint?.name ?? "Backlog"}</h2>
              {sprint ? (
                <span>
                  {sprint.startDate} – {sprint.endDate}
                </span>
              ) : null}
              {sprint?.status === "ACTIVE" || completed ? (
                <Badge variant="secondary">{completed ? "Completed" : "Active"}</Badge>
              ) : null}
              {sprint && !completed ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={pending}
                  onClick={() =>
                    onTransition(sprint.id, sprint.status === "ACTIVE" ? "complete" : "start")
                  }
                >
                  {sprint.status === "ACTIVE" ? "Complete Sprint" : "Start Sprint"}
                </Button>
              ) : null}
            </div>
            {sprint?.goal ? <p className="mt-1 text-xs italic">{sprint.goal}</p> : null}
            <div
              className="mt-4 min-h-12"
              onDragOver={(event) => {
                if (!completed) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();

                const id = event.dataTransfer.getData("text/plain");
                const issue = issues.find((item) => item.id === id);

                if (issue && !completed)
                  onMove({ id, sprintId: sprint?.id ?? "", status: issue.status });
              }}
            >
              {groupIssues.length ? (
                groupIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    disabled={completed || pending}
                    onEdit={() => onEdit(issue.id)}
                    onReorder={(direction) => onReorder(issue, direction)}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      const id = event.dataTransfer.getData("text/plain");

                      if (id !== issue.id)
                        onMove({
                          id,
                          sprintId: sprint?.id ?? "",
                          status: issue.status,
                          beforeId: issue.id,
                        });
                    }}
                  />
                ))
              ) : (
                <p className="py-2 text-xs">No issues found.</p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
