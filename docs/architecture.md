# Architecture

Kord is a modular monolith: Expo Router / React Native Web → Hono REST API → PostgreSQL through Drizzle. The workspace root is the repository root; an additional `kord/` wrapper adds no value.

- `apps/client`: cross-platform navigation, shared StyleSheet components/tokens, TanStack Query and validated connectivity checks.
- `apps/api`: HTTP application factory independent of network listeners, environment validation, database adapter and migrations.
- `packages/contracts`: Zod schemas consumed by API and client. Source exports are compiled by Metro/tsup.
- `packages/config`: strict base TypeScript configuration.
- `infra`: separate local PostgreSQL configuration and HTTPS deployment stack.

Expo SDK 55 was selected against its official compatibility table (React 19.2 / RN 0.83 / RN Web 0.21) and Better Auth's documented Expo integration. Native package pins follow `expo/bundledNativeModules.json`. Node 24 LTS satisfies Expo and Hono requirements. pnpm's hoisted linker avoids native tooling resolution inconsistencies. Direct versions and the lockfile are pinned. Check Expo compatibility before any upgrades.

Phase 2 will add auth, authorization, services and repositories as modules under `apps/api/src`; no empty module scaffolding is necessary yet. Better Auth will own credentials and sessions, using its official Expo plugin and SecureStore on native. No custom authentication is implemented. Phase 3 introduces schedule services; Phase 4 adds authenticated notification-only sockets.

References: https://docs.expo.dev/versions/v55.0.0/ ; https://better-auth.com/docs/integrations/expo ; https://hono.dev/docs/getting-started/nodejs ; https://orm.drizzle.team/docs/get-started/postgresql-new
