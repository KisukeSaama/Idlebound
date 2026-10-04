DROP INDEX "leaderboard_kings_idx";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "kings";--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "weavings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "leaderboard_weavings_idx" ON "leaderboard" USING btree ("weavings" desc);--> statement-breakpoint
-- Existing rows: the Descents of the stored save, at most one per thread woven (see migrateState, save version 13).
UPDATE "leaderboard" SET
  "weavings" = greatest(0, least(
    coalesce(floor(("saves"."state"->>'descents')::numeric), 0),
    coalesce(floor(("saves"."state"->'lifetime'->>'threads')::numeric), 0)
  ))::integer
FROM "saves" WHERE "saves"."user_id" = "leaderboard"."user_id";
