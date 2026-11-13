# Testing and Phase 1 verification

Verified in this Linux environment on 2026-11-10 using Node 24.22.1 and pnpm 11.25.0:

- Strict TypeScript: API, client and shared contracts passed.
- ESLint passed.
- Vitest: 11 tests passed (HTTP contracts, healthy/unavailable database dependency, CORS isolation, structured errors, configuration validation, client URL validation and API response validation).
- Expo dependency compatibility check passed.
- Drizzle initial migration and schema snapshot generated successfully.
- API production bundle and Expo single-page web export passed. The web JS bundle is approximately 1.8 MB uncompressed after scoped icon imports; this is not a loading-time benchmark.
- Android and iOS JS/Hermes exports passed. These are **not native application builds or device tests**.
- Playwright: 2 tests passed. Desktop Chromium and Pixel 7 viewport scenarios exercise responsive navigation, minimum touch-target height, appearance changes, deep-link refresh, overflow checks, and live browser → Hono connectivity. Screenshot artifacts are under `test-results/`.
- Compose YAML parsed; Docker validation/runtime was unavailable.

The API tests inject a database dependency. Browser E2E starts a real API with an unavailable local database and verifies honest readiness reporting. Neither replaces a real PostgreSQL integration test.

## Local Ubuntu walkthrough

On 2026-11-11, the project owner reported that Firefox loaded Kord, the appearance controls and responsive navigation worked, and the API connected. After starting PostgreSQL with Docker Compose and applying the initial migration, Kord showed Database ready. Stopping and restarting PostgreSQL changed the database status to unavailable and back to ready while the API stayed connected.

The owner also reported passing lint, type checking, all 11 Vitest tests, both Playwright browser tests, and the API and web builds.

## Local HTTPS deployment

On 2026-11-11, the project owner built and started the isolated Docker Compose stack. Caddy served `/settings` with HTTP 200 and proxied `/api/v1/ready`, which returned `{"status":"ready"}`. Curl verified HTTPS using Caddy's local root certificate. The owner also confirmed that Firefox could open and refresh the hosted Settings page and that the Connection screen reported API connected and Database ready. Reapplying the migration succeeded and kept the migration count at one. A backup restored into a separate database contained the application metadata table and the migration record.

## Reproduce

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @kord/client exec expo install --check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm --filter @kord/client exec expo export --platform android --platform ios --output-dir dist-native
```

Playwright may require OS browser libraries (`pnpm exec playwright install-deps chromium`). The test runner starts ports 3000 and 8081; keep those available. In CI set `CI=1` to disable server reuse.

## Physical Android device

On 2026-11-13, the project owner confirmed that the Android build succeeded and Kord opened on a physical phone. After starting the API, the app reported API connected and Database unavailable. Starting the development PostgreSQL container and retrying changed the status to Database ready. The owner also reported that the app functioned as expected during the phone navigation and appearance walkthrough.

The owner confirmed that TalkBack announces the result after activating Check again and reads Connection when opening that screen. Further announcement polish is deferred until the UI and wording are settled.

With TalkBack off, the owner verified that stopping and restarting the development database changed the Android app's status from Database ready to Database unavailable and back to Database ready.

## Remaining acceptance checks

The owner confirmed Kord runs on the Pixel 7 emulator and shows API connected and Database ready. Further TalkBack checks are deferred until the UI and wording are settled. On iOS, build and install Kord using a Mac and a device, then verify connectivity, failure/retry recovery, navigation, and accessibility.

Local Docker, Caddy HTTPS, migration re-run, and backup/restore checks passed. Physical Android build and connectivity checks passed. Pixel 7 emulator connectivity passed. iOS checks are pending. Phase 2 has not started.

## Checkpoints

Git was initialized on 2026-11-11. The GitHub remote is https://github.com/WaqasFarrukhs/Kord.git. Use `git log --oneline` to inspect local commits and `git status -sb` to inspect synchronization with GitHub. Earlier source checkpoints are saved under `.checkpoints/` (excluded from source control). Commit source plus `pnpm-lock.yaml`, keeping environment secrets and build outputs excluded.

## Appearance switches

The appearance settings use Follow device settings and Dark mode switches. Changing Dark mode disables automatic matching; disabling automatic matching preserves the current appearance. Preferences remain session-only. Desktop and mobile browser checks cover both device themes, manual overrides, and returning to automatic matching. The theme provider uses a stable appearance subscription to track device changes while the screen stays open. Native confirmation of the new switches is pending.
