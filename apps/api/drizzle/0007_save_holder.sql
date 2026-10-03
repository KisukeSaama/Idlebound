ALTER TABLE "guest_saves" ADD COLUMN "holder" text;--> statement-breakpoint
ALTER TABLE "guest_saves" ADD COLUMN "held_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "holder" text;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN "held_at" timestamp with time zone;