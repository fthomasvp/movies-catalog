CREATE TABLE IF NOT EXISTS "user" (
	"show_id" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"password" text,
	"created_at" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_idx" ON "user" ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_idx" ON "user" ("last_name");