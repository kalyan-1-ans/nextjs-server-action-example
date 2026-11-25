# Agent instructions

- Setup, credentials, and architecture: [README.md](README.md).
- This is a single-app demo. Use the requested stack; do not add ESLint, unit tests, E2E tests, or test tools. Do not run tests.
- Use npm and Node.js 24. Validate with `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm run build`.
- Read the version-matched Next.js guides in `node_modules/next/dist/docs/` before changing Next.js code. Use Context7 for other library guidance when available, requesting the installed version.
- Keep `cacheComponents: true`; do not author `use cache` directives or legacy `dynamic`/`revalidate` route exports. Stream request-time reads behind Suspense.
- Use default Next.js prefetching. Omit `Link` prefetch props and do not add `router.prefetch()` calls.
- Use `loading.tsx` for page-level loading. Keep explicit Suspense for granular sections or runtime reads in a layout, which the same segment’s loading file does not wrap.
- Read server data in Server Components through `src/server/services/`. Mutate through authenticated, validated Server Actions named `*.action.ts`. Call `refresh()` from `next/cache` after successful mutations. If the action redirects, refresh before redirecting when shared layout data also changes (for example the profile name in the header). Do not add cache invalidation for these uncached reads.
- Name dispatch functions passed to `useActionState` with an `Action` suffix.
- Keep blank lines after directives and imports, between declarations and handlers, and between logical validation, mutation, and return blocks. Oxfmt preserves this spacing; it does not add it.
- Use `useOptimistic` for transient mutation feedback. Jotai holds client UI state only; never copy server data into atoms or add React Query, Apollo, Redux, or SWR.
- Colocate route-only components in `_components/` and route-only helpers, schemas, and actions in `_lib/`. Share cross-route components through `src/components/`; design-system primitives live in `src/components/ui/`.
- Use TanStack Form and Zod for editable forms; validate untrusted inputs on the server too.
- Keep SQLite local. Commit schema, migrations, and seed data; never commit database files, secrets, or generated Prisma clients.
- Keep runtime Prisma queries and transactions in `src/server/services/*.service.ts`, with the client in `src/server/db.ts`. Auth, layouts, page data helpers, and actions call services rather than Prisma.
- Services are `server-only`, accept the authenticated user ID for scoped operations, and own business rules and transactions. Keep validation, redirects, and `refresh()` explicit in each action; do not introduce generic mutation wrappers.
- Enforce project membership inside data access and actions; do not rely on a protected layout alone.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
