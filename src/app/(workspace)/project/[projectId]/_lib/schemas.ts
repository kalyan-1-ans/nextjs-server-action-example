import { z } from "zod";
import { statuses } from "@/lib/schemas";

export const issueSchema = z.object({
  summary: z.string().trim().min(1, "Add a summary").max(160),
  description: z.string().max(5000),
  type: z.enum(["STORY", "BUG"]),
  status: z.enum(statuses),
  storyPoints: z
    .string()
    .regex(/^\d+$/, "Enter whole story points")
    .refine((value) => Number(value) <= 100, "Use 0–100 points"),
  assigneeUserId: z.string().max(100),
  sprintId: z.string().max(100),
});
export const sprintSchema = z
  .object({
    name: z.string().trim().min(1, "Name your sprint").max(100),
    goal: z.string().max(1000),
    startDate: z.iso.date("Choose a valid start date"),
    endDate: z.iso.date("Choose a valid end date"),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });
export const moveSchema = z.object({
  id: z.string().min(1).max(100),
  sprintId: z.string().max(100),
  status: z.enum(statuses),
  beforeId: z.string().max(100).optional(),
});

export type MoveInput = z.infer<typeof moveSchema>;
