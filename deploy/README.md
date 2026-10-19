# Operations

How the deployed stack is kept, restored and watched. The pipeline itself is
[.gitlab-ci.yml](../.gitlab-ci.yml); the services are [compose.yml](compose.yml).

On the host, each environment (`dev`, `prod`) lives in two folders:

- `${DEPLOY_DIR}/<env>`: `compose.yml`, `paths.env`, `app.env` (secrets), `backup.sh`, written
  by every deployment. Run Compose from there:
  `docker compose -p idlebound-<env> --env-file paths.env --env-file app.env -f compose.yml …`
  (written `compose …` below).
- `${DATA_DIR}/<env>`: `postgres/` (the database files) and `backups/` (the dumps).

## Backups

- **Daily.** The `backup` service dumps the database (`pg_dump -Fc`) whenever its newest daily
  dump is older than a day, checked every hour, and keeps 14 days of dumps in
  `${DATA_DIR}/<env>/backups` (`idlebound-<date>-<time>-daily.dump`). A dump is checked with
  `pg_restore --list` before it takes its name.
- **Before every deployment.** The deploy job runs the same script once
  (`idlebound-…-predeploy.dump`) before `compose up`: the API applies its migrations as it
  starts, and some drop columns. A failed dump stops the deployment.
- **Off the host.** Set the CI variable `IDLEBOUND_BACKUP_REMOTE` to an rclone remote written
  inline, for instance an S3-compatible bucket (Backblaze B2, Scaleway, OVH, R2):
  `:s3,provider=Other,endpoint=https://s3.example.com,access_key_id=…,secret_access_key=…:bucket/idlebound-prod`.
  The `offsite` service then copies the dumps there every six hours and deletes there what is
  older than 30 days. Without the variable, the dumps stay on the host only, which does not
  survive the loss of the host.
- **By hand**: `compose run --rm --no-deps backup once manual`.

## Restoring

1. Stop what writes: `compose stop web api`.
2. Pick a dump: `ls -lt ${DATA_DIR}/<env>/backups` (or fetch one from the remote with
   `rclone copy`).
3. Restore it over the database (the `backup` service has the credentials and the folder):

   ```bash
   compose run --rm --no-deps --entrypoint pg_restore backup \
     --clean --if-exists --no-owner --single-transaction -d "$POSTGRES_DB" \
     /backups/idlebound-20261019-040000-daily.dump
   ```

   `--single-transaction` leaves the database as it was if anything fails.
4. Start again: `compose up -d`. The API applies the migrations newer than the dump.

To look at a dump without touching the live database, restore it into a scratch database
first (`createdb` through the same `run`, then `-d <scratch>`). The round trip (migrated
schema, dump, restore into another database, rows and migrations compared) was tested on the
development Postgres.
