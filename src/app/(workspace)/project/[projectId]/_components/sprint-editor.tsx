"use client";

import { Dialog } from "@/components/ui/dialog";
import { ActionForm } from "@/components/action-form";
import { sprintSchema } from "../_lib/schemas";
import { createSprintAction } from "../_lib/sprint.action";

export function SprintEditor({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Create Sprint"
    >
      <ActionForm
        action={createSprintAction.bind(null, projectId)}
        onSuccess={onClose}
        schema={sprintSchema}
        defaults={{ name: "", goal: "", startDate: "", endDate: "" }}
        fields={[
          { name: "name", label: "Name", wide: true },
          { name: "goal", label: "Goals", type: "textarea", wide: true },
          { name: "startDate", label: "Start date", type: "date" },
          { name: "endDate", label: "End date", type: "date" },
        ]}
        submitLabel="Create"
      />
    </Dialog>
  );
}
