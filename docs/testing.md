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

## Remaining acceptance checks

1. On Docker: validate Compose, build images, start fresh PostgreSQL, apply migrations twice (second run should be a no-op), and verify `/api/v1/ready` returns 200. Stop the test database and verify 503; restore it and verify recovery.
2. Serve the exported app with Caddy over HTTPS; verify `/settings` on a fresh page load and the same-origin connection screen.
3. Build/install Android on an emulator and physical device, configure a reachable server, verify successful checks and failure/retry recovery. Repeat iOS on a Mac/device. Confirm safe-area navigation and accessibility.
4. Rehearse backup/restore into a new database as documented.

Docker, PostgreSQL server, Android SDK/emulator and Xcode are absent here. Native connectivity and container deployment must be verified before Phase 1 is fully signed off. Phase 2 has not started.

## Checkpoints

Git was initialized on 2026-11-11. The GitHub remote is https://github.com/WaqasFarrukhs/Kord.git. Use `git log --oneline` to inspect local commits and `git status -sb` to inspect synchronization with GitHub. Earlier source checkpoints are saved under `.checkpoints/` (excluded from source control). Commit source plus `pnpm-lock.yaml`, keeping environment secrets and build outputs excluded.
