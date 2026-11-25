# Jura · Server Components + Server Actions

The same Jira-style demo as the React Query + Zustand and Apollo + Jotai projects, using Server Components for reads and Server Actions for writes. The screens share their logo, cream background, dark buttons, project cards, sprint lists, and navigation so the state-management differences are easier to compare.

## Run

Use Node.js 24 (`nvm use`).

```bash
npm ci
npm run db:setup
npm run dev
```

Open http://localhost:3000. Log in with **`johndoe` / `Summertime2025`**.

Other usernames: `johnsmith`, `michael.smith`, `susan.jones`, `david.brown`, `emily.white`, `christopher.wilson`. All use the same demo password.

`db:setup` creates `.env` with a random authentication secret, prepares the local SQLite file, generates Prisma Client, applies migrations, and seeds the original 7 users, 9 projects, 36 sprints, and 57 issues. Running it again preserves existing records. Passwords are hashed with scrypt.

For another port, update `AUTH_URL` in `.env`, then run `npm run dev -- --port 3002`. `DATABASE_URL` defaults to `file:./prisma/dev.db`, relative to the project root. Keep `.env` and database files local.

## Demo flow

1. Log in to see owned and associated projects.
2. Open a project. The sidebar has **Active Sprint** and **Issues**.
3. Create or edit an issue from the sprint list. Choose its assignee, status, sprint, type, and story points in the dialog.
4. Create and start a sprint. Only one sprint per project can be active.
5. Drag issues between board columns, or change status in the issue dialog. Drag onto another issue to reorder; Alt+Up/Down on an issue title provides a keyboard alternative within its sprint and status.
6. Complete the sprint after all work is done, or move unfinished work elsewhere first. Completed sprints remain read-only history.
7. Open the notification bell to mark assignments read. Open the avatar menu for Profile or Logout. Saving or cancelling the profile returns to the dashboard.

## State-management comparison

| Responsibility          | React Query example    | Apollo example              | This app                     |
| ----------------------- | ---------------------- | --------------------------- | ---------------------------- |
| Read server data        | Query hooks / REST     | GraphQL query hooks         | Server Components / services |
| Write server data       | Query mutations        | GraphQL mutations           | `.action.ts` Server Actions  |
| Update rendered data    | Invalidate query cache | Update/refetch Apollo cache | `refresh()`                  |
| Temporary optimistic UI | Query cache updates    | Apollo optimistic response  | React `useOptimistic`        |
| Client UI state         | Zustand                | Jotai                       | Jotai dialog selection only  |
| Forms                   | React Hook Form        | React Hook Form             | TanStack Form + Zod          |

There is no client-side server-data store. Project, issue, sprint, notification, and user data arrive as server-rendered props. Jotai holds only which dialog is open and the selected issue ID. Form values and pending/error feedback stay with their components.

Issue, sprint, and notification actions call `refresh()` from `next/cache` after a successful write. This includes a fresh RSC tree in the action response so the current page and shared header reflect the database changes immediately. Profile saving also calls `refresh()` before redirecting to the dashboard so the shared header receives the updated name; a redirect alone can reuse the existing layout. There is no persistent server-data cache to invalidate.

The shared form uses `useActionState`, with a dispatcher named `submitAction`. Optimistic moves and notification reads provide immediate pending feedback, then reconcile with fresh server props on success or revert on failure. Server Actions validate input and authenticate the request, then call domain services. Services own the Prisma queries, membership checks, business rules, and write transactions. SQLite also enforces one active sprint per project.

## Rendering

`next.config.ts` enables `cacheComponents` and `partialPrefetching`. No application code uses `"use cache"`. Session and database reads run at request time behind Suspense; links use Next.js’s default automatic prefetching for navigation shells, with no explicit `prefetch` props or `router.prefetch()` calls. React `cache()` deduplicates the user lookup within a render only.

The shared `(workspace)/loading.tsx` supplies route-level loading UI. The dashboard also uses three sibling Suspense boundaries: welcome, owned projects, and associated projects. Each async section calls its own data function, and each project list runs its own filtered service query. Static section headings render immediately; one list does not wait for the other. The authenticated header streams independently from page content. `requireUser()` deduplicates the shared session/user lookup within the render. Login has its own `loading.tsx` inside a static layout.

For the streaming demo, content queries wait 2 seconds before reading SQLite: owned and associated projects, issues, sprints, project members, and notifications. The delay is defined once in `src/server/db-read-delay.ts`; change `2_000` to adjust it or `0` to disable it. Authentication, user identity, project access checks, and writes have no artificial delay. Parallel content queries wait together rather than adding their delays. After mutations, refreshed content reads also wait 2 seconds, so pending and optimistic UI remain visible longer.

Use `npm run build` and `npm start` to observe production prefetching. Dev/build use Webpack because Turbopack's CSS worker could not bind its internal port in the restricted environment used to build this demo.

## Next.js DevTools

Run `npm run dev` to use the built-in browser DevTools (the Next.js indicator in the bottom-left corner). They are unavailable with `npm start`, which serves the production build.

The project also configures `next-devtools-mcp` in `.codex/config.toml`, alongside Context7. Restart the coding-agent session to load it. With the dev server running, it can discover Next.js routes, errors, and logs through `/_next/mcp`.

## Files

- `src/app/(workspace)/dashboard/`: project cards and server query.
- `src/app/(workspace)/project/[projectId]/`: issues, board, dialogs, data, and actions.
- `src/app/(workspace)/profile/`: profile form and action.
- `src/app/login/`: login form and action.
- `src/components/`: shared header, notification/profile menus, form, and design primitives in `ui/`.
- `src/server/db.ts`: the Prisma client singleton.
- `src/server/services/`: `user.service.ts`, `project.service.ts`, `issue.service.ts`, `sprint.service.ts`, and `notification.service.ts`. All runtime database access lives here.
- `src/lib/`: authorization, shared schemas, password utilities, and the notification action.
- `src/state/ui.ts`: project-dialog atom.
- `prisma/`: schema, migrations, and seed data.

Services are server-only and receive the authenticated user ID for scoped queries and writes. Actions handle form validation, authentication, error messages, and `refresh()`/redirects; page data helpers compose service results for rendering. Prisma transaction types stay inside the service layer. The standalone `prisma/seed.ts` script remains responsible for database bootstrapping.

Route-only code lives in `_components` and `_lib` folders. Related project pages share these folders at their common route. The project issue list lives at `/project/[projectId]`, and the active sprint board at `/project/[projectId]/active`. Notifications are available only through the header popover.

## Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
npm start

npm run format
npm run db:setup
npm run db:generate
npm run db:studio
```

No unit or E2E tests or test frameworks are included. For a clean database, stop the app, delete `prisma/dev.db` and its `-shm`/`-wal` sidecars, then run `npm run db:setup`. This discards local edits.

This is a local demo with shared credentials. SQLite needs a persistent writable disk; account registration, password recovery, and login rate limiting are outside its scope.

## Project tooling

The stack is Next.js 16, React 19, Prisma 7, local SQLite, NextAuth/Auth.js 5 credentials (currently beta), Tailwind CSS v4, Base UI, shadcn/ui, TanStack Form, Zod, Jotai, TypeScript, Oxlint, and Oxfmt.

Relevant skills from the rendering-metrics project are in `.agents/skills`. Context7 is configured in `.codex/config.toml`; reopen the agent session to load it. Next.js's installed guides are in `node_modules/next/dist/docs/`.

If the machine's corporate npm registry reports expired credentials, authenticate with it or, where permitted, run `npm ci --registry=https://registry.npmjs.org --userconfig=/dev/null`. Context7's launcher uses the public registry without machine-specific credentials. A scoped npm override selects Effect 3.22.5 for Prisma 7.10's transitive dependency advisory.
