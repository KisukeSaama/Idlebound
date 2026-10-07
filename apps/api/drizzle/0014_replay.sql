CREATE TABLE "pending_seeds" (
	"owner" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"game_created_at" bigint NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pending_seeds_game_created_at_unique" UNIQUE("game_created_at")
);
--> statement-breakpoint
CREATE TABLE "presence_days" (
	"user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"crystals_seen" integer DEFAULT 0 NOT NULL,
	"crystals_caught" integer DEFAULT 0 NOT NULL,
	"reactions" jsonb NOT NULL,
	"powers" integer DEFAULT 0 NOT NULL,
	"prompt_powers" integer DEFAULT 0 NOT NULL,
	"ascensions" integer DEFAULT 0 NOT NULL,
	"acts" integer DEFAULT 0 NOT NULL,
	"longest_span_ms" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "presence_days_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
CREATE TABLE "presence_spans" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"started_at" bigint NOT NULL,
	"last_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replay_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"guest_id" text,
	"outcome" text NOT NULL,
	"detail" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "seed" text;--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "runtime" jsonb;--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "branch" jsonb;--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "parent" jsonb;--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "chain" jsonb;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "seed" text;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "runtime" jsonb;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "branch" jsonb;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "parent" jsonb;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "chain" jsonb;--> statement-breakpoint
ALTER TABLE "presence_days" ADD CONSTRAINT "presence_days_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presence_spans" ADD CONSTRAINT "presence_spans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replay_reports" ADD CONSTRAINT "replay_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pending_seeds_issued_idx" ON "pending_seeds" USING btree ("issued_at");--> statement-breakpoint
CREATE INDEX "replay_reports_user_idx" ON "replay_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "replay_reports_created_idx" ON "replay_reports" USING btree ("created_at");