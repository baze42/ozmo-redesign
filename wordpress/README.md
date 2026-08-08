# OZMO WordPress Content Setup

WordPress owns public content for V1: blog posts, services, transformation examples, and future landing pages. Postgres owns leads, bookings, admin notes, audit logs, private tokens, and operational data.

## Install Mu-Plugins

1. Copy `wordpress/mu-plugins` into the WordPress installation's `wp-content/mu-plugins` directory.
2. Confirm the following custom post types appear in the WordPress admin and REST API:
   - `service`
   - `transformation`
   - `landing_page`
3. Do not add a testimonial content type. Testimonials are out of scope for V1 until real approved testimonials exist and a later spec adds that model.

## Sync ACF JSON

Sync `wordpress/acf-json` into WordPress before testing the Astro build against real content.

1. Install and activate Advanced Custom Fields Pro.
2. Copy or sync `wordpress/acf-json` into the active theme or configured ACF JSON directory.
3. In WordPress admin, sync the field groups:
   - `OZMO Service Fields`
   - `OZMO Transformation Fields`
   - `OZMO Landing Page Fields`
4. Confirm each group has REST API visibility enabled.

## Rebuild Webhook

Set these environment variables for the WordPress runtime:

- `WORDPRESS_WEBHOOK_SECRET`: shared HMAC signing secret.
- `OZMO_REBUILD_WEBHOOK_URL`: Astro endpoint that receives WordPress publish events.

The rebuild webhook dispatches only published changes for `post`, `page`, `service`, `transformation`, and `landing_page`. Draft edits, autosaves, revisions, private updates, and trash transitions do not trigger public rebuilds.

Each webhook body includes:

- `content_type`
- `content_id`
- `slug`
- `status`
- `transition`
- `timestamp`

The request includes `X-Ozmo-Signature`, computed as HMAC-SHA256 over the JSON body with `WORDPRESS_WEBHOOK_SECRET`.
