CREATE TABLE "guest_saves" (
	"id" text PRIMARY KEY NOT NULL,
	"state" jsonb NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL,
	"game_created_at" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "save_rejections" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "save_rejections" ADD COLUMN "guest_id" text;--> statement-breakpoint
CREATE INDEX "guest_saves_last_seen_idx" ON "guest_saves" USING btree ("last_seen_at");