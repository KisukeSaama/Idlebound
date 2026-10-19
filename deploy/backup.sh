#!/bin/sh
# Database backups, run by the `backup` service of compose.yml (postgres image, so pg_dump
# matches the server's major version).
#
#   backup.sh          loop: a dump whenever the newest one is older than a day, checked
#                      every hour (a restart never skips nor doubles a day)
#   backup.sh once TAG one dump now, named after TAG (the CI's dump before a deployment)
#
# Dumps are custom-format (`pg_dump -Fc`), restored with pg_restore (deploy/README.md).
# Kept BACKUP_KEEP_DAYS days (14 by default) in /backups, the host folder
# ${DATA_DIR}/${DEPLOY_ENV}/backups. The `offsite` service copies them off the host.
set -eu

DIR=/backups
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"

dump() {
  name="idlebound-$(date +%Y%m%d-%H%M%S)-$1.dump"
  # Written under a temporary name: a dump cut short never looks like a good one.
  pg_dump -Fc --no-owner -f "$DIR/.partial.dump"
  # A dump pg_restore cannot read is not a backup.
  pg_restore --list "$DIR/.partial.dump" >/dev/null
  mv "$DIR/.partial.dump" "$DIR/$name"
  echo "backup: $name ($(du -h "$DIR/$name" | cut -f1))"
}

prune() {
  find "$DIR" -name 'idlebound-*.dump' -mtime "+$((KEEP_DAYS - 1))" -print -delete \
    | sed 's/^/backup: pruned /'
}

mkdir -p "$DIR"
umask 077

if [ "${1:-}" = "once" ]; then
  dump "${2:-manual}"
  exit 0
fi

until pg_isready -q; do sleep 5; done
while true; do
  # 1380 minutes: a dump that slipped a little still counts for its day.
  if [ -z "$(find "$DIR" -name 'idlebound-*-daily.dump' -mmin -1380)" ]; then
    dump daily || echo "backup: dump failed" >&2
    prune
  fi
  sleep 3600
done
