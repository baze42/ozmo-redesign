import { escapeHtml, type EmailTemplate } from '../lib/email/templates';

export function buildAdminBuildFailureEmail(input: {
  reason: string;
  eventCount: number;
  buildDurationMs: number;
  architectureReviewRequired: boolean;
  occurredAt: Date;
}): EmailTemplate {
  const durationSeconds = Math.round(input.buildDurationMs / 1000);
  const reviewLine = input.architectureReviewRequired
    ? 'Architecture review required: build duration exceeded five minutes.'
    : 'Architecture review not required for this event.';
  const subject = input.architectureReviewRequired
    ? 'OZMO WordPress rebuild failed - architecture review required'
    : 'OZMO WordPress rebuild failed';

  return {
    subject,
    html: [
      '<h1>WordPress rebuild alert</h1>',
      `<p><strong>Reason:</strong> ${escapeHtml(input.reason)}</p>`,
      `<p><strong>Events:</strong> ${input.eventCount}</p>`,
      `<p><strong>Build duration:</strong> ${durationSeconds} seconds</p>`,
      `<p><strong>Occurred at:</strong> ${escapeHtml(input.occurredAt.toISOString())}</p>`,
      `<p>${escapeHtml(reviewLine)}</p>`,
    ].join(''),
    text: [
      'WordPress rebuild alert',
      `Reason: ${input.reason}`,
      `Events: ${input.eventCount}`,
      `Build duration: ${durationSeconds} seconds`,
      `Occurred at: ${input.occurredAt.toISOString()}`,
      reviewLine,
    ].join('\n'),
  };
}
