import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conceptRoot = path.join(repoRoot, 'concepts', '01-digital-operations-partner');
const concept2Root = path.join(repoRoot, 'concepts', '02-local-growth-studio');
const concept3Root = path.join(repoRoot, 'concepts', '03-website-care-redesign');

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

function html2(page) {
  return fs.readFileSync(path.join(concept2Root, page), 'utf8');
}

function html3(page) {
  return fs.readFileSync(path.join(concept3Root, page), 'utf8');
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

function sectionMarkup(markup, heading) {
  const sections = [...markup.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)];
  const section = sections.find(({ 0: candidate }) =>
    new RegExp(`<h[1-6]\\b[^>]*>\\s*${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<\\/h[1-6]>`, 'i').test(candidate),
  );
  assert.ok(section, `expected a section headed "${heading}"`);
  return section[0];
}

function sectionText(markup, heading) {
  return withoutTags(sectionMarkup(markup, heading));
}

function assertSectionContains(markup, heading, required) {
  const text = sectionText(markup, heading);
  for (const phrase of required) {
    assert.match(
      text,
      new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `section "${heading}" should include "${phrase}"`,
    );
  }
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

test('Task 4 forms use JavaScript-enabled submission with a disabled source state', () => {
  for (const page of [pages.audit, pages.contact]) {
    assert.match(html(page), /<form\b[^>]*data-ozmo-form=/i, `${page} should opt into OZMO form behavior`);
    assert.match(html(page), /<button\b[^>]*data-enhanced-submit[^>]*disabled[^>]*type=["']button["']/i, `${page} should keep source submission disabled until JavaScript enhancement`);
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

test('home credibility section gives a concrete response standard', () => {
  assert.match(withoutTags(html(pages.home)), /respond within one business day/i);
});

test('generated images use responsive WebP sources, dimensions, and deferred loading below the fold', () => {
  const uses = [
    ['index.html', 'hero-digital-operations'],
    ['index.html', 'owner-focus'],
    ['index.html', 'systems-map'],
    ['site-audit.html', 'audit-desk'],
    ['about.html', 'owner-focus'],
    ['insights.html', 'insights-workshop'],
  ];
  for (const [page, image] of uses) {
    const markup = html(page);
    const pattern = new RegExp(`<picture>\\s*<source[^>]+srcset=["']assets/img/${image}\\.webp["'][^>]+type=["']image/webp["'][^>]*>\\s*<img[^>]+src=["']assets/img/${image}\\.png["'][^>]+width=["']\\d+["'][^>]+height=["']\\d+["'][^>]*>\\s*</picture>`, 'i');
    assert.match(markup, pattern, `${page} should serve ${image} through picture with intrinsic dimensions`);
  }
  for (const image of ['owner-focus', 'systems-map']) {
    assert.match(html(pages.home), new RegExp(`<img[^>]+src=["']assets/img/${image}\\.png["'][^>]+loading=["']lazy["']`, 'i'));
  }
});

test('concept 2 home follows the local growth StoryBrand flow', () => {
  const text = withoutTags(html2('index.html'));
  for (const required of [
    'Help more local customers find, trust, and choose you',
    'Be easier to find',
    'Be easier to trust',
    'Be easier to choose',
    'Local growth gets harder when the path is unclear',
    'A practical studio for the website, content, and follow-up behind local growth',
    'Website design for local trust',
    'Local SEO and service-page clarity',
    'Content and campaign support',
    'Lead follow-up and simple automation',
    'Request a site audit',
    'See the clearest local growth opportunities',
    'Build the website, content, and follow-up rhythm',
  ]) {
    assert.match(text, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('concept 2 pages include required local growth content', () => {
  const audit = withoutTags(html2('site-audit.html'));
  for (const required of [
    'Local first impression and message clarity',
    'Maps and local search basics',
    'Mobile speed and usability',
    'Service-page clarity',
    'Trust signals and proof readiness',
    'Inquiry path and follow-up',
    'Care and content rhythm',
    'Name',
    'Email',
    'Company',
    'Website URL',
    'What local growth goal matters most right now?',
    'Services you are interested in',
    'Timeline',
    'Notes',
  ]) {
    assert.match(audit, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  assert.match(withoutTags(html2('about.html')), /we do what we do so you can better do what you do/i);

  const insights = withoutTags(html2('insights.html'));
  for (const topic of [
    'How local customers decide whether to trust your website',
    'What your service pages should answer before someone calls',
    'Why local SEO starts with clear, useful pages',
    'Simple ways to keep marketing moving without doing everything',
    'What to check before boosting a post or running ads',
    'How faster follow-up helps good local leads choose you',
  ]) {
    assert.match(insights, new RegExp(topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  const contact = withoutTags(html2('contact.html'));
  for (const label of ['Name', 'Email', 'Company', 'Website URL', 'Reason for reaching out', 'Message']) {
    assert.match(contact, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('concept 2 public copy avoids forbidden proof and draft language', () => {
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
    const text = withoutTags(html2(page));
    for (const pattern of forbidden) {
      assert.doesNotMatch(text, pattern, `${page} should not contain ${pattern}`);
    }
  }
});

test('concept 3 home follows the website care and redesign StoryBrand flow', () => {
  const text = withoutTags(html3(pages.home));
  for (const required of [
    'Turn an outdated website into a clearer path to better leads',
    'Look current',
    'Make action easier',
    'Stay cared for',
    'Your website should not make people hesitate',
    'A practical specialist for redesign, care, and clearer lead paths',
    'Website redesign and message clarity',
    'Conversion paths and service-page structure',
    'Website care and maintenance',
    'Supporting marketing and follow-up',
    'Request a site audit',
    'See what needs redesign, repair, or care first',
    'Launch a clearer website and keep it working',
  ]) {
    assert.match(text, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  const markup = html3(pages.home);
  assertSectionContains(markup, 'The website improvement path', [
    'Audit',
    'Clarify',
    'Redesign',
    'Launch',
    'Care',
  ]);
  assertSectionContains(markup, 'Standards you can inspect', [
    'Audit depth',
    'Care standards',
    'Launch readiness',
    'Proof-ready structure',
  ]);
  assertSectionContains(markup, 'Notes for a website that stays useful', [
    'Five signs your website is costing you good leads',
    'What a healthy website care plan should include',
  ]);
});

test('concept 3 pages include required website care and redesign content', () => {
  const audit = withoutTags(html3(pages.audit));
  for (const required of [
    'First impression and message clarity',
    'Mobile usability and speed cues',
    'Service-page structure',
    'Call-to-action and inquiry path',
    'Trust signals and proof readiness',
    'Care, security, and maintainability',
    'Content freshness and update rhythm',
    'What is not working on your website right now?',
  ]) {
    assert.match(audit, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  const auditMarkup = html3(pages.audit);
  assertSectionContains(auditMarkup, 'What to expect from this review', [
    'Practical review',
    'Fit conversation',
    'Not a fake instant score',
  ]);
  assert.match(
    sectionMarkup(auditMarkup, 'What to expect from this review'),
    /<a\b[^>]*href=["']contact\.html["']/i,
    'the audit expectations section should link to the Contact page',
  );

  const insights = withoutTags(html3(pages.insights));
  for (const topic of [
    'Five signs your website is costing you good leads',
    'What to fix before you start a redesign',
    'What a healthy website care plan should include',
    'Why conversion paths matter more than visual polish alone',
    'How follow-up keeps good website inquiries from going quiet',
  ]) {
    assert.match(insights, new RegExp(topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('concept 3 services present website care and redesign work in the approved order', () => {
  const markup = html3(pages.services);
  const text = withoutTags(markup);
  const ordered = [
    'Website redesign and message clarity',
    'Conversion paths and service-page structure',
    'Website care and maintenance',
    'Supporting marketing and follow-up',
  ];
  let previous = -1;
  for (const service of ordered) {
    const index = text.indexOf(service);
    assert.ok(index > previous, `${service} should appear after the previous service`);
    previous = index;
  }

  assertSectionContains(markup, 'Website redesign and care overview', [
    'Redesign',
    'Care',
  ]);
  for (const service of ordered) {
    assertSectionContains(markup, service, [
      'Owner problem',
      'What we handle',
      'Signs you need this',
      'Owner outcome',
    ]);
  }
  assertSectionContains(markup, 'How the work can connect', [
    'Audit',
    'Redesign',
    'Launch',
    'Care',
    'Selective growth support',
  ]);
});

test('concept 3 about page covers its approach, standards, and proof-ready layout', () => {
  const markup = html3(pages.about);
  assertSectionContains(markup, 'The choices behind the work', [
    'Clarify before redesigning',
    'Design the next step',
    'Build for care and maintainability',
    'Keep the website current',
    'Improve only what helps the customer path',
  ]);
  assertSectionContains(markup, 'Design standards that support a clear next step', [
    'Clean hierarchy',
    'Conversion-minded',
    'Reusable page patterns',
  ]);
  assertSectionContains(markup, 'Working rhythm', [
    'Audit',
    'Clarify',
    'Redesign',
    'Launch',
    'Care',
    'Improve',
  ]);
  assertSectionContains(markup, 'Proof should have a useful place', [
    'Service-specific evidence',
    'Before-and-after context',
    'Audit examples',
  ]);
});

test('concept 3 forms use JavaScript-enabled submission with a disabled source state', () => {
  for (const page of [pages.audit, pages.contact]) {
    assert.match(html3(page), /<form\b[^>]*data-ozmo-form=/i, `${page} should opt into OZMO form behavior`);
    assert.match(html3(page), /<button\b[^>]*data-enhanced-submit[^>]*disabled[^>]*type=["']button["']/i, `${page} should keep source submission disabled until JavaScript enhancement`);
    assert.match(html3(page), /data-form-status/i, `${page} should expose a form status message`);
  }
});

test('concept 3 public copy avoids forbidden proof and draft language', () => {
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
    const text = withoutTags(html3(page));
    for (const pattern of forbidden) {
      assert.doesNotMatch(text, pattern, `${page} should not contain ${pattern}`);
    }
  }
});
