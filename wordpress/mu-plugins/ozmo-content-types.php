<?php
/**
 * Plugin Name: OZMO Public Content Types
 * Description: Registers the public content models consumed by the Astro frontend.
 * Version: 1.0.0
 * Author: OZMO Digital
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'ozmo_register_public_content_types');

function ozmo_register_public_content_types(): void
{
    register_post_type('service', [
        'labels' => [
            'name' => __('Services', 'ozmo'),
            'singular_name' => __('Service', 'ozmo'),
            'add_new_item' => __('Add New Service', 'ozmo'),
            'edit_item' => __('Edit Service', 'ozmo'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-admin-tools',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'services'],
    ]);

    register_post_type('transformation', [
        'labels' => [
            'name' => __('Transformations', 'ozmo'),
            'singular_name' => __('Transformation', 'ozmo'),
            'add_new_item' => __('Add New Transformation', 'ozmo'),
            'edit_item' => __('Edit Transformation', 'ozmo'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-update',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'portfolio'],
    ]);

    register_post_type('landing_page', [
        'labels' => [
            'name' => __('Landing Pages', 'ozmo'),
            'singular_name' => __('Landing Page', 'ozmo'),
            'add_new_item' => __('Add New Landing Page', 'ozmo'),
            'edit_item' => __('Edit Landing Page', 'ozmo'),
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-welcome-widgets-menus',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions'],
        'has_archive' => false,
        'rewrite' => ['slug' => 'landing'],
    ]);
}
