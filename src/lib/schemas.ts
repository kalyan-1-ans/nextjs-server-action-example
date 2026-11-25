import { z } from "zod";

export const statuses = ["TO_DO", "IN_PROGRESS", "REVIEW", "DONE"] as const;
export const statusLabels = {
  TO_DO: "To do",
  IN_PROGRESS: "In progress",
  REVIEW: "In review",
  DONE: "Done",
};
export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username").max(100),
  password: z.string().min(1, "Enter your password").max(200),
});
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters").max(80),
});
