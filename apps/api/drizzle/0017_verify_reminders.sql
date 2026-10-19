ALTER TABLE "users" ADD COLUMN "verify_reminders" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verify_reminded_at" timestamp with time zone;