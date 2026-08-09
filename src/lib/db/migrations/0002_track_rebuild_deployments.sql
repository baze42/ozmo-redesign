ALTER TABLE "rebuild_events" ADD COLUMN "deploy_triggered_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rebuild_events" ADD COLUMN "deployment_id" text;--> statement-breakpoint
ALTER TABLE "rebuild_events" ADD COLUMN "deployment_state" text;--> statement-breakpoint
ALTER TABLE "rebuild_events" ADD COLUMN "deployment_url" text;--> statement-breakpoint
CREATE UNIQUE INDEX "rebuild_events_event_hash_idx" ON "rebuild_events" USING btree ("event_hash");--> statement-breakpoint
CREATE INDEX "rebuild_events_status_scheduled_at_idx" ON "rebuild_events" USING btree ("status","scheduled_at");--> statement-breakpoint
CREATE INDEX "rebuild_events_status_triggered_at_idx" ON "rebuild_events" USING btree ("status","deploy_triggered_at");