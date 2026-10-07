ALTER TABLE "leaderboard" ADD COLUMN "mornings" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "morning_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "leaderboard_morning_idx" ON "leaderboard" USING btree ("morning_at" desc nulls last);