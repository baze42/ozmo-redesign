import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureEmailSender, sendEmail } from '../../../src/lib/email/resend';

afterEach(() => {
  configureEmailSender(null);
  vi.unstubAllEnvs();
});

describe('sendEmail', () => {
  it('throws when email delivery is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('RESEND_FROM_EMAIL', '');

    await expect(
      sendEmail({
        to: ['owner@ozmodigital.com'],
        subject: 'OZMO alert',
        html: '<p>Alert</p>',
        text: 'Alert',
      }),
    ).rejects.toThrow('RESEND_API_KEY and RESEND_FROM_EMAIL are required before sending email');
  });

  it('uses a configured test sender when provided', async () => {
    const sender = vi.fn();
    configureEmailSender(sender);

    await sendEmail({
      to: ['owner@ozmodigital.com'],
      subject: 'OZMO alert',
      html: '<p>Alert</p>',
      text: 'Alert',
    });

    expect(sender).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['owner@ozmodigital.com'],
        subject: 'OZMO alert',
      }),
    );
  });
});
