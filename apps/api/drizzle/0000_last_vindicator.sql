CREATE TABLE IF NOT EXISTS "movie" (
	"id" text,
	"show_id" text,
	"type" text,
	"title" text,
	"director" text,
	"cast" text,
	"country" text,
	"date_added" text,
	"release_year" text,
	"rating" text,
	"duration" text,
	"listed_in" text,
	"description" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "title_idx" ON "movie" ("title");