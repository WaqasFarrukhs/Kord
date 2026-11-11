# Roadmap

## Phase 1 — Foundation
Implementation: monorepo, Expo/Hono, shared contracts, Drizzle schema/migration, PostgreSQL and Caddy Compose, light/dark design tokens, responsive navigation, live connection diagnostics and initial automated tests.

Passed: lint, strict type checks, 11 unit/API tests, 2 browser E2E tests, Expo dependency compatibility, API/web builds, and Android/iOS JavaScript exports. Validation detail is recorded in `docs/testing.md`. The local Ubuntu walkthrough verified PostgreSQL connectivity and recovery. The local Caddy HTTPS website and API checks passed, including direct browser navigation and readiness. Migration re-run and backup/restore checks also passed. Native builds and device checks remain pending.

## Phase 2 — Accounts, workspaces, and admin panel
Better Auth, official Expo integration/SecureStore, accounts, deterministic development seed, workspaces, membership, invitations, authorization and isolation tests.

### Admin panel

Build a protected screen where the Kord administrator can:

- View and create user accounts.
- Disable or delete accounts and revoke their active sessions.
- Change user privileges. Platform admin privileges are separate from permissions within a workspace.
- Review a history of administrator actions.

Extend account deletion handling in Phase 3 as scheduling data is introduced. See [product scope](scope.md) for the safeguards and design decisions.

## Phase 3 — Scheduling
Tasks/events, assignment, calendar/routines, bounded recurrence, timezone/DST behavior, per-occurrence exceptions and completion.

## Phase 4 — Synchronisation
Authenticated sockets, optimistic writes, version conflicts, reconnection/refetch, offline indicators, reminders and filtering.

## Phase 5 — Verification
Real-device builds, collaboration E2E, full security matrix, performance workload/p95 measurements and production restore rehearsal. No performance or reliable offline-write claim before verification.
