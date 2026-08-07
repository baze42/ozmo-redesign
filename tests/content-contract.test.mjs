import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conceptRoot = path.join(repoRoot, 'concepts', '01-digital-operations-partner');

const pages = {
  home: 'index.html',
  services: 'services.html',
  audit: 'site-audit.html',
  about: 'about.html',
  insights: 'insights.html',
  contact: 'contact.html',
};

function html(page) {
  return fs.readFileSync(path.join(conceptRoot, page), 'utf8');
}

function withoutTags(markup) {
  return markup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function publicCopy(markup) {
  const body = markup.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? '';
  const descriptions = [...markup.matchAll(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi)]
    .map((match) => match[1]);
  return `${withoutTags(body)} ${descriptions.join(' ')}`;
}

test('home page implements the approved StoryBrand flow', () => {
  const text = withoutTags(html(pages.home));
  for (const required of [
    'Let OZMO handle the digital layer behind your growth',
    'Request a site audit',
    'Save time',
    'Capture better leads',
    'Grow with confidence',
    'The digital work keeps expanding',
    'A steady guide for the digital work you should not have to carry alone',
    'Website design and redesign',
    'Website care and maintenance',
    'Digital marketing, SEO, and content',
    'Automation, CRM, and email workflows',
    'Request a site audit',
    'Review a clear digital operations plan',
    'Let OZMO build and manage the system',
  ]) {
    assert.match(text, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('services page presents services in the approved order', () => {
  const text = withoutTags(html(pages.services));
  const ordered = [
    'Website design and redesign',
    'Website care and maintenance',
    'Digital marketing, SEO, and content',
    'Automation, CRM, and email workflows',
  ];
  let previous = -1;
  for (const service of ordered) {
    const index = text.indexOf(service);
    assert.ok(index > previous, `${service} should appear after the previous service`);
    previous = index;
  }
  assert.match(text, /owner problem/i);
  assert.match(text, /what we handle/i);
  assert.match(text, /signs you need this/i);
  assert.match(text, /business outcome/i);
});

test('site audit page includes required audit review areas and form fields', () => {
  const text = withoutTags(html(pages.audit));
  for (const required of [
    'First impression and message clarity',
    'Speed and mobile usability',
    'Service-page conversion path',
    'Lead capture and follow-up',
    'Local SEO basics',
    'Care, security, and maintainability',
    'Automation opportunities',
    'What happens next',
    'Name',
    'Email',
    'Company',
    'Website URL',
    'What feels hardest right now?',
    'Services you are interested in',
    'Timeline',
    'Notes',
  ]) {
    assert.match(text, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('about, insights, and contact pages include required approved content', () => {
  assert.match(withoutTags(html(pages.about)), /we do what we do so you can better do what you do/i);
  assert.match(withoutTags(html(pages.about)), /audit, plan, build, care, improve/i);
  assert.match(withoutTags(html(pages.insights)), /Five signs your website is costing you good leads/i);
  assert.match(withoutTags(html(pages.insights)), /Why slow follow-up costs local businesses more than they think/i);
  assert.match(withoutTags(html(pages.contact)), /Reason for reaching out/i);
  assert.match(withoutTags(html(pages.contact)), /Message/i);
});

test('public pages avoid forbidden proof and draft language', () => {
  const forbidden = [
    /lorem ipsum/i,
    /fake testimonial/i,
    /fake client/i,
    /prototype only/i,
    /todo/i,
    /tbd/i,
    /unfinished/i,
    /verified result/i,
  ];
  for (const page of Object.values(pages)) {
    const text = withoutTags(html(page));
    for (const pattern of forbidden) {
      assert.doesNotMatch(text, pattern, `${page} should not contain ${pattern}`);
    }
  }
});

test('public body and meta copy uses OZMO first-person voice', () => {
  const forbidden = [
    /OZMO Digital brings/i,
    /OZMO connects/i,
    /OZMO uses/i,
    /OZMO will use/i,
    /OZMO reviews/i,
    /OZMO brings the website/i,
    /OZMO handles/i,
  ];
  for (const page of Object.values(pages)) {
    const text = publicCopy(html(page));
    for (const pattern of forbidden) {
      assert.doesNotMatch(text, pattern, `${page} should use we/you language instead of ${pattern}`);
    }
  }
});

test('Task 4 forms submit through progressive enhancement', () => {
  for (const page of [pages.audit, pages.contact]) {
    assert.match(html(page), /<form\b[^>]*data-ozmo-form=/i, `${page} should opt into OZMO form behavior`);
    assert.match(html(page), /<button\b[^>]*type=["']submit["']/i, `${page} should use a submit button`);
    assert.match(html(page), /data-form-status/i, `${page} should expose a form status message`);
  }
});

test('public copy avoids remaining faceless voice phrases', () => {
  const forbidden = [
    /the owner is left/i,
    /Some businesses begin/i,
    /visitors ask/i,
    /Visitors may be interested/i,
    /Give prospects/i,
  ];
  for (const page of Object.values(pages)) {
    const text = publicCopy(html(page));
    for (const pattern of forbidden) {
      assert.doesNotMatch(text, pattern, `${page} should use direct we/you voice instead of ${pattern}`);
    }
  }
});

test('Insights public copy speaks directly to you', () => {
  const text = publicCopy(html(pages.insights));
  for (const pattern of [
    /service-business owners/i,
    /business owners/i,
    /Care is more than emergency fixes/i,
    /Speed matters/i,
  ]) {
    assert.doesNotMatch(text, pattern, `insights.html should use direct we/you voice instead of ${pattern}`);
  }
});
