import { escapeHtml, type EmailTemplate } from '../lib/email/templates';
import type { WordPressAlert } from '../lib/wordpress/client';

export function buildWordPressSnapshotFallbackEmail(alert: WordPressAlert): EmailTemplate {
  const subject = `OZMO WordPress snapshot fallback used for ${alert.contentType}`;
  const cause =
    alert.error.cause instanceof Error ? ` Cause: ${alert.error.cause.message}` : '';
  const status = alert.error.status ? ` HTTP status: ${alert.error.status}.` : '';
  const details = `${alert.error.message}${status}${cause}`;

  return {
    subject,
    html: [
      '<h1>WordPress snapshot fallback used</h1>',
      '<p>The site build used last-known-good WordPress content because the live CMS request failed.</p>',
      '<dl>',
      `<dt>Content type</dt><dd>${escapeHtml(alert.contentType)}</dd>`,
      `<dt>Snapshot key</dt><dd>${escapeHtml(alert.snapshotKey)}</dd>`,
      `<dt>Error code</dt><dd>${escapeHtml(alert.error.code)}</dd>`,
      `<dt>Details</dt><dd>${escapeHtml(details)}</dd>`,
      '</dl>',
    ].join(''),
    text: [
      'WordPress snapshot fallback used',
      `Content type: ${alert.contentType}`,
      `Snapshot key: ${alert.snapshotKey}`,
      `Error code: ${alert.error.code}`,
      `Details: ${details}`,
    ].join('\n'),
  };
}
