CREATE TABLE "replay_tally" (
	"day" date NOT NULL,
	"outcome" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "replay_tally_day_outcome_pk" PRIMARY KEY("day","outcome")
);
