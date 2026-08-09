import { Resend } from 'resend';

import { getEnv } from '../config/env';

import type { EmailMessage } from './templates';

export type EmailSender = (message: EmailMessage) => Promise<void>;

export function createResendEmailSender(options: {
  apiKey: string;
  from: string;
  replyTo?: string;
}): EmailSender {
  const resend = new Resend(options.apiKey);

  return async (message) => {
    const response = await resend.emails.send({
      from: message.from ?? options.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo ?? options.replyTo,
    });

    if (response.error) {
      throw new Error(`Resend email send failed: ${response.error.message}`);
    }
  };
}

let configuredEmailSender: EmailSender | null = null;
let defaultEmailSender: EmailSender | null = null;

export function configureEmailSender(sender: EmailSender | null) {
  configuredEmailSender = sender;
}

export async function sendEmail(message: EmailMessage) {
  const sender = getActiveEmailSender();

  if (!sender) {
    throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL are required before sending email.');
  }

  await sender(message);
}

function getActiveEmailSender(): EmailSender | null {
  if (configuredEmailSender) {
    return configuredEmailSender;
  }

  const env = getEnv();

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return null;
  }

  defaultEmailSender ??= createResendEmailSender({
    apiKey: env.RESEND_API_KEY,
    from: env.RESEND_FROM_EMAIL,
    replyTo: env.RESEND_REPLY_TO_EMAIL || undefined,
  });

  return defaultEmailSender;
}
