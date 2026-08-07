const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const formModule = require(path.resolve(__dirname, '../concepts/01-digital-operations-partner/assets/js/site.js'));
const conceptRoot = path.resolve(__dirname, '../concepts/01-digital-operations-partner');

test('validateFields reports required email and URL errors', () => {
  const result = formModule.OZMOForms.validateFields(
    [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', required: true, type: 'email' },
      { name: 'website', label: 'Website URL', required: false, type: 'url' },
    ],
    { name: '', email: 'not-an-email', website: 'not-a-url' }
  );

  assert.equal(result.valid, false);
  assert.equal(result.errors.name, 'Name is required.');
  assert.equal(result.errors.email, 'Enter a valid email address.');
  assert.equal(result.errors.website, 'Enter a valid URL that starts with http:// or https://.');
});

test('validateFields accepts complete audit values', () => {
  const result = formModule.OZMOForms.validateFields(
    [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', required: true, type: 'email' },
      { name: 'website', label: 'Website URL', required: true, type: 'url' },
      { name: 'pain', label: 'What feels hardest right now?', required: true },
    ],
    {
      name: 'Pat Owner',
      email: 'pat@example.com',
      website: 'https://example.com',
      pain: 'The website is stale and follow-up is inconsistent.',
    }
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('FORM_ENDPOINTS default to empty strings for static no-network review', () => {
  assert.deepEqual(formModule.FORM_ENDPOINTS, { audit: '', contact: '' });
});

test('formDataToObject preserves repeated form values as arrays', () => {
  const formData = new FormData();
  formData.append('services', 'Website design and redesign');
  formData.append('services', 'Automation, CRM, and email workflows');

  assert.deepEqual(formModule.OZMOForms.formDataToObject(formData), {
    services: ['Website design and redesign', 'Automation, CRM, and email workflows'],
  });
});

test('source forms preserve native validation and use privacy-preserving static POST fallbacks', () => {
  for (const page of ['site-audit.html', 'contact.html']) {
    const html = fs.readFileSync(path.join(conceptRoot, page), 'utf8');
    const form = html.match(/<form\b[^>]*data-ozmo-form=[^>]*>/i)?.[0] ?? '';
    assert.doesNotMatch(form, /\bnovalidate\b/i, `${page} should preserve native validation before JavaScript runs`);
    assert.match(form, /\bmethod=["']post["']/i, `${page} should use POST when JavaScript is unavailable`);
    assert.match(form, /\baction=["']["']/i, `${page} should keep no-JavaScript form data on the current page until a production endpoint is configured`);
    assert.doesNotMatch(form, /\baction=["']mailto:/i, `${page} should not expose form data in a mailto URL or guess a recipient`);
    assert.match(html, /<p class="form-status"[^>]*role="status"/i, `${page} status should have status semantics`);
    assert.match(html, /<p class="error-message"[^>]*role="alert"/i, `${page} errors should have alert semantics`);
  }
});

test('enhancement opts out of native validation only after JavaScript loads', () => {
  const siteJs = fs.readFileSync(path.join(conceptRoot, 'assets/js/site.js'), 'utf8');
  assert.match(siteJs, /documentRef\.documentElement\.classList\.add\(['"]js['"]\)/);
  assert.match(siteJs, /form\.setAttribute\(['"]novalidate['"],\s*['"]['"]\)/);
});

test('enhanced form submissions mark the form pending and disable the submit control', () => {
  const siteJs = fs.readFileSync(path.join(conceptRoot, 'assets/js/site.js'), 'utf8');
  assert.match(siteJs, /form\.dataset\.submitting\s*===\s*['"]true['"]/);
  assert.match(siteJs, /form\.dataset\.submitting\s*=\s*['"]true['"]/);
  assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*true/);
  assert.match(siteJs, /delete form\.dataset\.submitting/);
  assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*false/);
});
