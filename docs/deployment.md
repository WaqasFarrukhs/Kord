# Deployment and operations

Target: Debian VM with Docker/Compose, initially 2 vCPU / 4 GB RAM. Build images on a larger machine if bundling exceeds available memory. No existing host services or volumes need modification.

1. Point a domain at the server and make ports 80/443 reachable for Caddy certificates.
2. Copy `infra/docker/.env.example` to `infra/docker/.env`. Set domain and a strong password. Set DATABASE_URL using host `db` and the same password, URL-encoded.
3. From the repository root, run:

```sh
docker compose --env-file infra/docker/.env -f infra/docker/compose.yaml config --quiet
docker compose --env-file infra/docker/.env -f infra/docker/compose.yaml up -d --build
```

The one-shot migration service must finish successfully before API starts. Web waits for API readiness. No database port is published. Caddy serves the Expo single-page export and forwards `/api/*` to Hono without rewriting paths. Direct navigation to `/settings` falls back to `index.html`. The client uses same-origin requests; a separate native build must use the public HTTPS domain.

For upgrades, back up first; build images, then run the migration service explicitly using `docker compose ... run --rm migrate`, and bring up services only on success. Do not run concurrent migration jobs. Failed migrations require investigation; never drop volumes to solve an upgrade error. Rollback may require restoring a compatible database backup and prior image/source checkpoint.

## Backups and restore

Replace `...` below with `--env-file infra/docker/.env -f infra/docker/compose.yaml`. Store backups outside the VM, restrict access and encrypt off-host storage. Back up configuration/secrets securely and preserve the Caddy volumes separately.

```sh
docker compose ... exec -T db pg_dump -U kord -d kord -Fc > kord.dump
```

Rehearse restoration into a **new empty database**, not the live database:

```sh
docker compose ... exec -T db createdb -U kord kord_restore
docker compose ... exec -T db pg_restore -U kord -d kord_restore --no-owner < kord.dump
```

Point an isolated API at the restored database, check readiness and application data, then plan any production cutover separately. Never run `down -v` against retained data. Scheduled backups and restore verification remain operator responsibilities.

## Monitoring

Inspect `docker compose ... ps` and logs. API JSON logs contain status and request duration; they deliberately omit user data. Alert on failed readiness, restarts, disk use, certificate failure and backup age. GET `/api/v1/health` checks API liveness; `/api/v1/ready` includes database/schema readiness. Measure p95 latency against a documented workload once authenticated scheduling exists; no throughput claim is made now.

Docker images, Compose deployment and real PostgreSQL migration/restore have not been run in the current environment because Docker is absent.
