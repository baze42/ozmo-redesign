ALTER TABLE "rebuild_events" ADD COLUMN "deploy_job_id" text;--> statement-breakpoint
ALTER TABLE "rebuild_events" ADD COLUMN "deploy_job_state" text;--> statement-breakpoint
ALTER TABLE "rebuild_events" ADD COLUMN "deploy_job_created_at" timestamp with time zone;