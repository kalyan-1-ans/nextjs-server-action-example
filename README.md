# Jura · Server Components + Server Actions

A Jira-style project and sprint demo. Server Components read data, Server Actions write data, and Jotai tracks dialog selection. This app is the request-time baseline for the Cache Components comparison.

## Run

Use Node.js 24 (`nvm use`), then:

```bash
npm ci
npm run db:setup
npm run dev
```

Open http://localhost:3000 and log in with **`johndoe` / `Summertime2025`**. Other seeded accounts use the same password.

`db:setup` creates a local `.env`, SQLite database, migrations, and seed data. Keep `.env` and `prisma/dev.db` local. To use another port, update `AUTH_URL` in `.env` and pass `--port` to `npm run dev`.

## Demo

View owned and associated projects, open a project, edit and move issues, create and complete sprints, mark assignment notifications read, and update your profile. Completed sprint issues are read-only.

| Concern             | Implementation                             |
| ------------------- | ------------------------------------------ |
| Data reads          | Server Components and server-only services |
| Writes and refresh  | Validated Server Actions and `refresh()`   |
| Optimistic feedback | React `useOptimistic`                      |
| UI state            | Jotai dialog selection only                |
| Forms               | TanStack Form and Zod                      |

Actions authenticate and validate each write. Services own scoped Prisma queries, membership checks, business rules, and transactions.

## Rendering comparison

Cache Components and partial prefetching are enabled, but application data reads are not cached. Reads stream at request time behind Suspense, making this the baseline for `nextjs-cache-component-private-example`.

Content reads wait **1 second** before querying SQLite. Adjust or disable the delay in `src/server/db-read-delay.ts`. Authentication checks and writes are not delayed. Use `npm run build` and `npm start` to compare production navigation behavior.

## Useful commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
npm start
npm run db:setup
npm run db:studio
```

The app uses Next.js 16, React 19, Prisma 7, SQLite, Auth.js credentials, Tailwind CSS, and TypeScript. No unit or E2E test suite is included.
