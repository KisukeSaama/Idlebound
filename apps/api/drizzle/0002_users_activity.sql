ALTER TABLE "users" ADD COLUMN "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locale" text DEFAULT 'fr' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "inactivity_notice_at" timestamp with time zone;--> statement-breakpoint
UPDATE "users" SET "last_seen_at" = greatest("users"."created_at", "users"."last_login_at", (SELECT "saves"."updated_at" FROM "saves" WHERE "saves"."user_id" = "users"."id"));--> statement-breakpoint
CREATE INDEX "users_last_seen_idx" ON "users" USING btree ("last_seen_at");