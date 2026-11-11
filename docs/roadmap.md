# Roadmap

## Phase 1 — Foundation
Implementation: monorepo, Expo/Hono, shared contracts, Drizzle schema/migration, PostgreSQL and Caddy Compose, light/dark design tokens, responsive navigation, live connection diagnostics and initial automated tests.

Passed: lint, strict type checks, 11 unit/API tests, 2 browser E2E tests, Expo dependency compatibility, API/web builds, and Android/iOS JavaScript exports. Validation detail is recorded in `docs/testing.md`. Native device connectivity and Docker/PostgreSQL deployment require their respective environments before Phase 1 can be fully signed off.

## Phase 2 — Identity and workspaces
Better Auth, official Expo integration/SecureStore, accounts, deterministic development seed, workspaces, membership, invitations, authorization and isolation tests.

Add the operator administration portal for user creation, deactivation/deletion and privilege management, with separate platform roles, server-side authorization and audit history. See `scope.md` for the proposed safeguards and decisions to resolve.

## Phase 3 — Scheduling
Tasks/events, assignment, calendar/routines, bounded recurrence, timezone/DST behavior, per-occurrence exceptions and completion.

## Phase 4 — Synchronisation
Authenticated sockets, optimistic writes, version conflicts, reconnection/refetch, offline indicators, reminders and filtering.

## Phase 5 — Verification
Real-device builds, collaboration E2E, full security matrix, performance workload/p95 measurements and production restore rehearsal. No performance or reliable offline-write claim before verification.
