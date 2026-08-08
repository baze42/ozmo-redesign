<?php
/**
 * Plugin Name: OZMO Rebuild Webhook
 * Description: Sends signed publish events for public WordPress content to Astro.
 * Version: 1.0.0
 * Author: OZMO Digital
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('transition_post_status', 'ozmo_dispatch_rebuild_webhook', 10, 3);

function ozmo_dispatch_rebuild_webhook(string $new_status, string $old_status, WP_Post $post): void
{
    if ($new_status !== 'publish') {
        return;
    }

    if (wp_is_post_autosave($post) || wp_is_post_revision($post)) {
        return;
    }

    $content_types = ['post', 'page', 'service', 'transformation', 'landing_page'];
    if (!in_array($post->post_type, $content_types, true)) {
        return;
    }

    $secret = getenv('WORDPRESS_WEBHOOK_SECRET');
    $webhook_url = getenv('OZMO_REBUILD_WEBHOOK_URL');

    if (!$secret || !$webhook_url) {
        error_log('OZMO rebuild webhook skipped because configuration is missing.');
        return;
    }

    $payload = [
        'content_type' => $post->post_type,
        'content_id' => (int) $post->ID,
        'slug' => $post->post_name,
        'status' => $new_status,
        'transition' => $old_status . '->' . $new_status,
        'timestamp' => gmdate('c'),
    ];

    $body = wp_json_encode($payload);
    if (!$body) {
        error_log('OZMO rebuild webhook skipped because payload encoding failed.');
        return;
    }

    $signature = hash_hmac('sha256', $body, $secret);

    wp_remote_post($webhook_url, [
        'timeout' => 5,
        'headers' => [
            'Content-Type' => 'application/json',
            'X-Ozmo-Signature' => $signature,
        ],
        'body' => $body,
    ]);
}
