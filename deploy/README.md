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

## One walker's game

Besides the dumps, the API keeps each account's game as its first save of the day left it,
for 30 days (`save_snapshots`). To give a walker back yesterday's game without touching
anyone else's, from the `api` container (`compose exec api sh`):

- `node review.js --snapshots <username>`: the days kept, their revision and best stage;
- `node review.js --restore <username> --day YYYY-MM-DD`: that day's game becomes the
  account's, as a new revision; open pages are asked to choose.

## Rolling back

Every build pushes its images twice: under the branch (`main`, `develop`) and under the
commit (`$CI_COMMIT_SHA`). A deployment runs its own commit's images, so a later push never
changes what it ran.

To go back to an earlier release, run the manual job `rollback_prod` (or `rollback_dev`) of the
latest pipeline with the variable `ROLLBACK_SHA` set to the full hash of the commit to go back
to. It writes the deployment files of the current commit, dumps the database as any
deployment does, then starts the earlier commit's images.

- The database keeps the migrations the later release applied. A migration that only added
  something is harmless to the earlier code; one that dropped or renamed a column is not:
  then restore the `predeploy` dump taken before that release (see Restoring) after rolling
  back, and what was saved since is lost.
- A save written by the later release with a newer save version is never relabelled by the
  earlier code: it refuses it, and the page keeps the game in hand until the later release is
  back.

## Watching

- `api` answers `/live` (its event loop turns, nothing else) and `/health` (the database
  answers too). Its healthcheck marks it unhealthy when `/health` fails, and acts as a
  watchdog: six `/live` probes in a row without an answer (about a minute and a half) end
  node, the container exits and restarts (`init: true` makes this possible; the log says
  `watchdog: no answer, node ended`). A database that is down never restarts the API. The
  watchdog was tested in a container whose event loop blocks: it restarted once, then ran.
- Errors met by pages are logged by the API as `[client]` lines:
  `compose logs api | grep '\[client\]'`. Replay reports are `[api] replay` lines (and the
  `replay_reports` table, summarised by `node review.js --replays`).
- The API keeps 5 logs of 50 MB, the other services 3 of 10 MB.
- An uptime check from outside the host is still to set up (Uptime Kuma, Better Stack, or any
  monitor that alerts): watch `https://<host>/api/health`, which answers 200 when the web, the
  API and the database all answer.
