# Kord

Phase 1 foundation for a self-hosted scheduling app, sharing an Expo/React Native frontend across web, Android and iOS. Accounts and scheduling are not implemented yet.

## Prerequisites

- Node.js 24 LTS and pnpm 11.25.0 (`npm install -g pnpm@11.25.0`).
- Docker Engine with Compose v2 for local PostgreSQL and deployment.
- Android Studio/JDK/Android SDK for Android builds; macOS with Xcode for iOS builds.

## Local setup

Run from this repository root:

```sh
pnpm install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/client/.env.example apps/client/.env
docker compose -f infra/docker/compose.dev.yaml up -d --wait
pnpm db:migrate
```

Run `pnpm dev:api` in one terminal and `pnpm dev:web` in another. Open http://localhost:8081 and choose **Check connection**. Both API and database should be ready. The API binds port 3000; Expo binds 8081. Without PostgreSQL, liveness still works and diagnostics correctly report database unavailable.

For this Codex environment only, Node is bundled outside PATH. Prefix commands with:

```sh
export PATH=/home/waqas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH
```

## Android / iOS and LAN testing

Set `EXPO_PUBLIC_API_URL=http://YOUR_SERVER_LAN_IP:3000` in `apps/client/.env`; restart Expo after changes. Never use localhost for a physical device. Permit the development API/Metro ports on the trusted LAN, and keep the phone and computer on reachable networks. For browser testing via a LAN URL, add the exact browser origin to API `WEB_ORIGINS` (comma-separated list).

Run `pnpm --filter @kord/client android` with an emulator or USB-debugging device connected. On a Mac with Xcode, run `pnpm --filter @kord/client ios`. Install native platform prerequisites first. A compatible Expo Go build may be used for exploration; development builds are the reliable target and must match SDK 55. Native builds/device checks have not been verified in the current environment. Prefer HTTPS for deployed native connections; development HTTP policies can vary by platform/build.

On each platform, open Connection, verify API connected and Database ready, stop the API and retry to verify an error, then restart and retry. Appearance supports device/light/dark for the current app session.

## Commands

| Command | Purpose |
|---|---|
| `pnpm typecheck` | Strict TypeScript across workspaces |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest contracts/client/API tests |
| `pnpm exec playwright install chromium` | Install browser test runtime |
| `pnpm test:e2e` | Desktop + mobile viewport browser tests with real Hono server |
| `pnpm build` | API bundle + static Expo web export |
| `pnpm db:generate` | Generate versioned migration from schema |
| `pnpm db:migrate` | Apply pending migrations |

## Configuration and API

API: `DATABASE_URL` required; `PORT` defaults to 3000; `NODE_ENV` defaults to development; `WEB_ORIGINS` defaults to http://localhost:8081. Production origins require HTTPS. Client: `EXPO_PUBLIC_API_URL` is a public HTTP(S) origin. If omitted on web, the current browser origin is used (Caddy deployment); native requires explicit configuration. No secrets belong in Expo public variables.

- `GET /api/v1/health` → 200 `{status:"ok",service:"kord-api",apiVersion:"v1"}`.
- `GET /api/v1/ready` → 200 `{status:"ready"}` or 503 `{status:"unavailable"}`; checks the migrated database.
- Unknown endpoint → 404 `{error:{code:"NOT_FOUND",message:"Endpoint not found"}}`.

See [architecture](docs/architecture.md), [database](docs/database.md), [security](docs/security.md), [permissions](docs/permissions.md), [deployment](docs/deployment.md), [testing](docs/testing.md), and [roadmap](docs/roadmap.md).

The [product scope](docs/scope.md) includes the planned administration portal and learning preferences.
