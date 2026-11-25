"use client";

import { useState, useOptimistic, useTransition, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAtom } from "jotai";
import { projectDialogAtom } from "@/state/ui";
import { Button } from "@/components/ui/button";
import { moveIssueAction } from "../_lib/issue.action";
import { transitionSprintAction } from "../_lib/sprint.action";
import type { MoveInput } from "../_lib/schemas";
import type { ProjectData, IssueItem } from "../_lib/data";
import { IssueEditor } from "./issue-editor";
import { SprintEditor } from "./sprint-editor";
import { SprintList } from "./sprint-list";
import { SprintBoard } from "./sprint-board";

function applyMove(issues: IssueItem[], input: MoveInput) {
  const issue = issues.find((item) => item.id === input.id);

  if (!issue) return issues;

  const remaining = issues.filter((item) => item.id !== input.id);
  const beforeIndex = input.beforeId
    ? remaining.findIndex((item) => item.id === input.beforeId)
    : remaining.length;

  remaining.splice(beforeIndex < 0 ? remaining.length : beforeIndex, 0, {
    ...issue,
    sprintId: input.sprintId || null,
    status: input.status,
  });

  return remaining;
}

export function IssueWorkspace({ data, board }: { data: ProjectData; board: boolean }) {
  const { project, sprints, users } = data;

  const router = useRouter();

  const [issues, optimisticMove] = useOptimistic(data.issues, applyMove);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [dialog, setDialog] = useAtom(projectDialogAtom);

  // Close transient dialogs when Next.js Activity hides this route.
  useLayoutEffect(() => () => setDialog(null), [setDialog]);

  const active = sprints.find((sprint) => sprint.status === "ACTIVE");
  const selectedIssue =
    dialog?.type === "issue" ? (issues.find((issue) => issue.id === dialog.issueId) ?? null) : null;

  function move(input: MoveInput) {
    if (pending || !issues.some((issue) => issue.id === input.id)) return;

    setError("");

    startTransition(async () => {
      optimisticMove(input);

      try {
        const result = await moveIssueAction(project.id, input);

        if (result.error) setError(result.error);
      } catch {
        setError("Unable to move issue. Please try again.");
      }
    });
  }

  function reorder(issue: IssueItem, direction: number) {
    const group = issues.filter(
      (item) => item.sprintId === issue.sprintId && item.status === issue.status,
    );
    const index = group.findIndex((item) => item.id === issue.id);
    const target = index + direction;

    if (target < 0 || target >= group.length) return;

    move({
      id: issue.id,
      sprintId: issue.sprintId ?? "",
      status: issue.status,
      beforeId: direction < 0 ? group[target].id : group[target + 1]?.id,
    });
  }

  function transition(sprintId: string, value: "start" | "complete") {
    setError("");

    startTransition(async () => {
      try {
        const result = await transitionSprintAction(project.id, sprintId, value);

        if (result.error) setError(result.error);
        else if (value === "complete" && board) router.push(`/project/${project.id}`);
      } catch {
        setError("Unable to update sprint. Please try again.");
      }
    });
  }

  const openIssue = (issueId: string | null) => setDialog({ type: "issue", issueId });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {board ? (active?.name ?? "No active sprint") : "Issues"}
          </h1>
          {board && active?.goal ? <p className="mt-1 text-gray-600">{active.goal}</p> : null}
        </div>
        <div className="ml-auto flex gap-3">
          {!board || active ? (
            <Button variant={board ? "default" : "outline"} onClick={() => openIssue(null)}>
              Create Issue
            </Button>
          ) : null}
          {board ? (
            active ? (
              <Button
                variant="outline"
                disabled={pending}
                onClick={() => transition(active.id, "complete")}
              >
                Complete Sprint
              </Button>
            ) : null
          ) : (
            <Button variant="outline" onClick={() => setDialog({ type: "sprint" })}>
              Create Sprint
            </Button>
          )}
        </div>
      </div>
      {error ? (
        <p role="alert" className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <output className="sr-only">{pending ? "Saving changes…" : ""}</output>
      {board ? (
        active ? (
          <SprintBoard
            issues={issues}
            sprintId={active.id}
            pending={pending}
            onEdit={openIssue}
            onMove={move}
            onReorder={reorder}
          />
        ) : (
          <Link href={`/project/${project.id}`} className="underline">
            View issues and start a sprint
          </Link>
        )
      ) : (
        <SprintList
          issues={issues}
          sprints={sprints}
          pending={pending}
          onEdit={openIssue}
          onTransition={transition}
          onMove={move}
          onReorder={reorder}
        />
      )}
      {dialog?.type === "issue" ? (
        <IssueEditor
          key={dialog.issueId ?? "new"}
          projectId={project.id}
          issue={selectedIssue}
          initialSprintId={board ? (active?.id ?? "") : ""}
          users={users}
          sprints={sprints}
          onClose={() => setDialog(null)}
        />
      ) : null}
      {dialog?.type === "sprint" ? (
        <SprintEditor projectId={project.id} onClose={() => setDialog(null)} />
      ) : null}
    </>
  );
}
