CREATE TABLE "content_snapshots" (
	"content_type" text NOT NULL,
	"snapshot_key" text PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"payload_hash" text NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"used_at" timestamp with time zone
);
