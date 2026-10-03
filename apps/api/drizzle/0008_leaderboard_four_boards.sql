DROP TABLE "stage_history" CASCADE;--> statement-breakpoint
DROP INDEX "leaderboard_ascensions_idx";--> statement-breakpoint
DROP INDEX "leaderboard_essences_idx";--> statement-breakpoint
DROP INDEX "leaderboard_achievements_idx";--> statement-breakpoint
DROP INDEX "leaderboard_descents_idx";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "ascensions";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "essences";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "achievements";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "descents";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "play_time";--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "kings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "promises" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "crystals" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "leaderboard_kings_idx" ON "leaderboard" USING btree ("kings" desc);--> statement-breakpoint
CREATE INDEX "leaderboard_promises_idx" ON "leaderboard" USING btree ("promises" desc);--> statement-breakpoint
CREATE INDEX "leaderboard_crystals_idx" ON "leaderboard" USING btree ("crystals" desc);--> statement-breakpoint
-- Existing rows: the three tallies of the stored save, already verified when it was accepted.
UPDATE "leaderboard" SET
  "kings" = coalesce(floor(("saves"."state"->'lifetime'->>'kings')::numeric), 0)::integer,
  "crystals" = coalesce(floor(("saves"."state"->'lifetime'->>'crystals')::numeric), 0)::integer,
  "promises" = coalesce((select sum(floor("value"::numeric)) from jsonb_each_text(coalesce("saves"."state"->'promises', '{}'::jsonb))), 0)::integer
FROM "saves" WHERE "saves"."user_id" = "leaderboard"."user_id";
