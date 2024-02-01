DROP INDEX IF EXISTS "director_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "cast_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "country_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "director_idx" ON "movie" ("director");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cast_idx" ON "movie" ("cast");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "country_idx" ON "movie" ("country");