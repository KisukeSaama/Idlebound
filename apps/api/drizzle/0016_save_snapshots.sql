CREATE TABLE "save_snapshots" (
	"user_id" uuid NOT NULL,
	"day" date NOT NULL,
	"state" jsonb NOT NULL,
	"revision" integer NOT NULL,
	"max_stage" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "save_snapshots_user_id_day_pk" PRIMARY KEY("user_id","day")
);
--> statement-breakpoint
ALTER TABLE "save_snapshots" ADD CONSTRAINT "save_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "save_snapshots_day_idx" ON "save_snapshots" USING btree ("day");