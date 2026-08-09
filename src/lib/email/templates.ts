export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailMessage extends EmailTemplate {
  to: string[];
  from?: string;
  replyTo?: string;
}

export function parseEmailList(value: string): string[] {
  return value
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
