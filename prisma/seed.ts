import "dotenv/config";
import {
  PrismaClient,
  type IssueStatus,
  type IssueType,
  type SprintStatus,
} from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "../src/lib/password";
import users from "./data/users.json";
import projects from "./data/projects.json";
import sprints from "./data/sprints.json";
import issues from "./data/issues.json";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! }),
});

async function seed() {
  await db.$transaction(
    async (tx) => {
      for (const user of users)
        await tx.user.upsert({
          where: { id: user.id },
          update: {},
          create: { ...user, passwordHash: hashPassword("Summertime2025") },
        });

      for (const project of projects) {
        await tx.project.upsert({
          where: { id: project.id },
          update: {},
          create: { ...project, key: project.name.slice(0, 2).toUpperCase() },
        });

        for (const user of users)
          await tx.membership.upsert({
            where: { userId_projectId: { userId: user.id, projectId: project.id } },
            update: {},
            create: { userId: user.id, projectId: project.id },
          });
      }

      for (const sprint of sprints)
        await tx.sprint.upsert({
          where: { id: sprint.id },
          update: {},
          create: {
            ...sprint,
            startDate: sprint.startDate.slice(0, 10),
            endDate: sprint.endDate.slice(0, 10),
            status: sprint.status as SprintStatus,
          },
        });

      for (const [index, issue] of issues.entries()) {
        await tx.issue.upsert({
          where: { id: issue.id },
          update: {},
          create: {
            ...issue,
            orderIndex: index,
            type: issue.type as IssueType,
            status: issue.status as IssueStatus,
          },
        });

        if (issue.assigneeUserId)
          await tx.notification.upsert({
            where: { id: `seed-${issue.id}` },
            update: {},
            create: {
              id: `seed-${issue.id}`,
              userId: issue.assigneeUserId,
              issueId: issue.id,
              message: `${issue.issueNumber} has been assigned to you.`,
            },
          });
      }
    },
    { timeout: 30000 },
  );
  console.log(
    "Seeded 7 users, 9 projects, 36 sprints, and 57 issues. Login: johndoe / Summertime2025",
  );
}

seed().finally(() => db.$disconnect());
