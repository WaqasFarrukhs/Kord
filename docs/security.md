# Security

Phase 1 exposes only public, minimal liveness/readiness endpoints. There are no user-data endpoints or authentication bypasses. A healthy foundation is not yet suitable for storing personal schedules.

Browser origins are explicitly allowed; production configuration rejects non-HTTPS origins. CORS is not authorization. Credentials are not logged, errors do not include database details, queries use Drizzle parameterization, and database connections/timeouts are bounded. Logs include method, status and elapsed milliseconds without URLs, headers or bodies. Expo public environment variables are compiled into the client: never put secrets there.

Production PostgreSQL has no published port and uses an internal Docker network. Caddy terminates HTTPS. The local database exposes only loopback with an explicitly development-only password. Secrets and build output are excluded from Git and Docker contexts.

Before identity ships: Better Auth email/password, official Expo plugin and SecureStore, secure web cookies, CSRF controls, rate limits, session revocation and authorization integration tests. Before sockets ship: short-lived single-use connection tickets, subscription authorization and membership-revocation handling. None of those protections are claimed as implemented in Phase 1.
