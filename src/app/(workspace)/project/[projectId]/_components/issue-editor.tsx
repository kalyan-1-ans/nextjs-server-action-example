"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActionForm } from "@/components/action-form";
import { issueSchema } from "../_lib/schemas";
import { saveIssueAction, deleteIssueAction } from "../_lib/issue.action";
import { statuses, statusLabels } from "@/lib/schemas";
import type { IssueItem, ProjectData } from "../_lib/data";

export function IssueEditor({
  projectId,
  issue,
  users,
  sprints,
  initialSprintId,
  onClose,
}: {
  projectId: string;
  issue: IssueItem | null;
  users: ProjectData["users"];
  sprints: ProjectData["sprints"];
  initialSprintId: string;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!issue) return;

    startTransition(async () => {
      try {
        const result = await deleteIssueAction(projectId, issue.id);

        if (result.error) setError(result.error);
        else onClose();
      } catch {
        setError("Couldn't delete the issue. Try again.");
      }
    });
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
      title={issue ? issue.issueNumber : "Create Issue"}
      description={issue ? `Reported by ${issue.reporter.name}` : undefined}
    >
      {error ? (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <ActionForm
        action={saveIssueAction.bind(null, projectId, issue?.id ?? null)}
        onSuccess={onClose}
        schema={issueSchema}
        defaults={{
          summary: issue?.summary ?? "",
          description: issue?.description ?? "",
          type: issue?.type ?? "STORY",
          status: issue?.status ?? "TO_DO",
          storyPoints: String(issue?.storyPoints ?? 0),
          assigneeUserId: issue?.assigneeUserId ?? "",
          sprintId: issue?.sprintId ?? initialSprintId,
        }}
        fields={[
          { name: "summary", label: "Summary", wide: true },
          { name: "description", label: "Description", type: "textarea", wide: true },
          {
            name: "type",
            label: "Type",
            options: [
              { value: "STORY", label: "Story" },
              { value: "BUG", label: "Bug" },
            ],
          },
          {
            name: "status",
            label: "Status",
            options: statuses.map((value) => ({ value, label: statusLabels[value] })),
          },
          { name: "storyPoints", label: "Story points", type: "number" },
          {
            name: "assigneeUserId",
            label: "Assignee",
            options: [
              { value: "", label: "Unassigned" },
              ...users.map((user) => ({ value: user.id, label: user.name })),
            ],
          },
          {
            name: "sprintId",
            label: "Sprint",
            wide: true,
            options: [
              { value: "", label: "Backlog" },
              ...sprints
                .filter((sprint) => sprint.status !== "COMPLETED")
                .map((sprint) => ({ value: sprint.id, label: sprint.name })),
            ],
          },
        ]}
        submitLabel={issue ? "Save" : "Create"}
      >
        {issue ? (
          <Button variant="ghost" type="button" onClick={remove} disabled={pending}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        ) : null}
      </ActionForm>
    </Dialog>
  );
}
