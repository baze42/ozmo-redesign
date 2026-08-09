import { describe, expect, it, vi } from 'vitest';

import { getEnv } from '../../../src/lib/config/env';

const baseEnv = {
  PUBLIC_SITE_URL: 'https://ozmodigital.com',
  PUBLIC_PLAUSIBLE_DOMAIN: 'ozmodigital.com',
  PUBLIC_PLAUSIBLE_SRC: 'https://plausible.io/js/script.js',
};

describe('getEnv', () => {
  it('uses safe public defaults when no environment source is provided', () => {
    const env = getEnv({});

    expect(env.PUBLIC_SITE_URL).toBe('https://ozmodigital.com');
    expect(env.PUBLIC_PLAUSIBLE_DOMAIN).toBe('ozmodigital.com');
    expect(env.PUBLIC_PLAUSIBLE_SRC).toBe('https://plausible.io/js/script.js');
  });

  it('returns typed public defaults and launch settings', () => {
    const env = getEnv(baseEnv);

    expect(env.PUBLIC_SITE_URL).toBe('https://ozmodigital.com');
    expect(env.PUBLIC_PLAUSIBLE_DOMAIN).toBe('ozmodigital.com');
    expect(env.PUBLIC_PLAUSIBLE_SRC).toBe('https://plausible.io/js/script.js');
    expect(env.OZMO_BUSINESS_TIMEZONE).toBe('America/Chicago');
    expect(env.OZMO_REVIEW_WEEKLY_CAPACITY).toBe(5);
    expect(env.PRODUCTION_LAUNCH_APPROVED).toBe(false);
    expect(env.OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES).toBe(false);
  });

  it('parses numeric and boolean launch gate values', () => {
    const env = getEnv({
      ...baseEnv,
      OZMO_REVIEW_WEEKLY_CAPACITY: '7',
      PRODUCTION_LAUNCH_APPROVED: 'true',
      OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: 'true',
    });

    expect(env.OZMO_REVIEW_WEEKLY_CAPACITY).toBe(7);
    expect(env.PRODUCTION_LAUNCH_APPROVED).toBe(true);
    expect(env.OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES).toBe(true);
  });

  it('throws a readable error when a URL value is invalid', () => {
    expect(() =>
      getEnv({
        ...baseEnv,
        PUBLIC_SITE_URL: 'not-a-url',
      }),
    ).toThrow(/Invalid environment configuration: PUBLIC_SITE_URL/);
  });

  it('does not log secret values when validation fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      getEnv({
        ...baseEnv,
        PUBLIC_PLAUSIBLE_SRC: 'not-a-url',
        RESEND_API_KEY: 'secret-value',
      }),
    ).toThrow(/PUBLIC_PLAUSIBLE_SRC/);
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
