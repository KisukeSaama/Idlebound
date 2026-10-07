DROP INDEX "leaderboard_morning_idx";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "mornings";--> statement-breakpoint
ALTER TABLE "leaderboard" DROP COLUMN "morning_at";