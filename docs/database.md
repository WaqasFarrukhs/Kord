# Database

Phase 1 stores infrastructure metadata only (`application_metadata`, text primary key, non-null value, timezone-aware updated timestamp). Drizzle tracks applied, versioned migrations. Readiness verifies the table exists; a reachable but unmigrated database is not ready.

Run `pnpm db:generate` after schema changes; inspect the resulting SQL and commit the migration, journal and snapshot. Run `pnpm db:migrate` from the root to apply pending migrations. Never use schema push against production. Back up before migrations and deploy one migration runner before the API.

Future model: Better Auth users/sessions/accounts/verification; workspaces/memberships/invitations; schedule items/assignees; recurrence rules/exceptions/occurrence completions; shared-item activity. UUID identities, foreign keys, indexes, version checks and privacy constraints arrive with the corresponding business features and isolation tests. No user data is stored in Phase 1.
