CREATE TABLE "stage_history" (
	"user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"max_stage" integer NOT NULL,
	CONSTRAINT "stage_history_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
DROP INDEX "leaderboard_stage_idx";--> statement-breakpoint
ALTER TABLE "leaderboard" ADD COLUMN "stage_reached_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
-- Existing rows: the last accepted save is the best known bound of when the stage was reached.
UPDATE "leaderboard" SET "stage_reached_at" = "updated_at";--> statement-breakpoint
ALTER TABLE "stage_history" ADD CONSTRAINT "stage_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stage_history_day_idx" ON "stage_history" USING btree ("day");--> statement-breakpoint
CREATE INDEX "leaderboard_stage_idx" ON "leaderboard" USING btree ("max_stage" desc,"stage_reached_at");