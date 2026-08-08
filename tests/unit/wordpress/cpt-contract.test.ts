import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const wordpressRoot = resolve(process.cwd(), 'wordpress');

function readRequiredFile(path: string) {
  const fullPath = resolve(wordpressRoot, path);
  expect(existsSync(fullPath), `${path} should exist`).toBe(true);

  return readFileSync(fullPath, 'utf8');
}

function readAcfGroup(path: string) {
  return JSON.parse(readRequiredFile(path)) as {
    title: string;
    show_in_rest: number;
    location: Array<Array<{ param: string; operator: string; value: string }>>;
    fields: Array<{ name: string; type: string; required?: number }>;
  };
}

describe('WordPress content type contract', () => {
  it('registers only the V1 public content CPTs with REST enabled', () => {
    const plugin = readRequiredFile('mu-plugins/ozmo-content-types.php');

    for (const postType of ['service', 'transformation', 'landing_page']) {
      expect(plugin).toContain(`register_post_type('${postType}'`);
      expect(plugin).toMatch(
        new RegExp(`register_post_type\\('${postType}'[\\s\\S]+?'show_in_rest'\\s*=>\\s*true`),
      );
      expect(plugin).toMatch(
        new RegExp(`register_post_type\\('${postType}'[\\s\\S]+?'public'\\s*=>\\s*true`),
      );
    }

    expect(plugin).not.toContain("register_post_type('testimonial'");
    expect(plugin).not.toContain('register_post_type("testimonial"');
  });

  it('defines REST-visible ACF fields for services', () => {
    const group = readAcfGroup('acf-json/group_ozmo_service.json');

    expect(group.title).toBe('OZMO Service Fields');
    expect(group.show_in_rest).toBe(1);
    expect(group.location[0]).toContainEqual({
      param: 'post_type',
      operator: '==',
      value: 'service',
    });
    expect(group.fields.map((field) => field.name)).toEqual([
      'summary',
      'business_outcomes',
      'body_sections',
      'cta_label',
      'cta_url',
      'sort_order',
      'seo_title',
      'seo_description',
      'og_image',
    ]);
  });

  it('defines REST-visible ACF fields for transformation examples without testimonial fields', () => {
    const group = readAcfGroup('acf-json/group_ozmo_transformation.json');

    expect(group.title).toBe('OZMO Transformation Fields');
    expect(group.show_in_rest).toBe(1);
    expect(group.location[0]).toContainEqual({
      param: 'post_type',
      operator: '==',
      value: 'transformation',
    });
    expect(group.fields.map((field) => field.name)).toEqual([
      'before_state',
      'what_is_not_working',
      'ozmo_improvement_path',
      'expected_business_impact',
      'cta_label',
      'cta_url',
      'sort_order',
      'mockup_variant',
      'seo_title',
      'seo_description',
      'og_image',
    ]);
    expect(group.fields.map((field) => field.name).join(' ')).not.toMatch(/testimonial/i);
  });

  it('defines future landing page fields without adding public V1 routes', () => {
    const group = readAcfGroup('acf-json/group_ozmo_landing_page.json');

    expect(group.title).toBe('OZMO Landing Page Fields');
    expect(group.show_in_rest).toBe(1);
    expect(group.location[0]).toContainEqual({
      param: 'post_type',
      operator: '==',
      value: 'landing_page',
    });
    expect(group.fields.map((field) => field.name)).toEqual([
      'hero_heading',
      'hero_summary',
      'audience',
      'sections',
      'cta_label',
      'cta_url',
      'seo_title',
      'seo_description',
      'og_image',
    ]);
  });

  it('documents WordPress deployment and content ownership rules', () => {
    const readme = readRequiredFile('README.md');

    expect(readme).toContain('WordPress owns public content');
    expect(readme).toContain('Testimonials are out of scope for V1');
    expect(readme).toContain('Copy `wordpress/mu-plugins`');
    expect(readme).toContain('Sync `wordpress/acf-json`');
  });
});

describe('WordPress publish webhook contract', () => {
  it('signs publish webhooks with HMAC-SHA256 and the shared secret', () => {
    const plugin = readRequiredFile('mu-plugins/ozmo-rebuild-webhook.php');

    expect(plugin).toContain('hash_hmac');
    expect(plugin).toContain('sha256');
    expect(plugin).toContain("getenv('WORDPRESS_WEBHOOK_SECRET')");
    expect(plugin).toContain('X-Ozmo-Signature');
  });

  it('dispatches only relevant published-content changes', () => {
    const plugin = readRequiredFile('mu-plugins/ozmo-rebuild-webhook.php');

    for (const postType of ['post', 'page', 'service', 'transformation', 'landing_page']) {
      expect(plugin).toContain(`'${postType}'`);
    }

    expect(plugin).toContain('transition_post_status');
    expect(plugin).toContain("new_status !== 'publish'");
    expect(plugin).toContain('wp_is_post_autosave');
    expect(plugin).toContain('wp_is_post_revision');
    expect(plugin).toContain('wp_remote_post');
    expect(plugin).toContain('content_type');
    expect(plugin).toContain('content_id');
    expect(plugin).toContain('slug');
    expect(plugin).toContain('transition');
    expect(plugin).toContain('timestamp');
  });
});
