const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const formModule = require(path.resolve(__dirname, '../concepts/01-digital-operations-partner/assets/js/site.js'));
const conceptRoot = path.resolve(__dirname, '../concepts/01-digital-operations-partner');
const concept2Module = require(path.resolve(__dirname, '../concepts/02-local-growth-studio/assets/js/site.js'));
const concept2Root = path.resolve(__dirname, '../concepts/02-local-growth-studio');

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

test('source forms keep no-JavaScript submission explicitly unavailable', () => {
  for (const page of ['site-audit.html', 'contact.html']) {
    const html = fs.readFileSync(path.join(conceptRoot, page), 'utf8');
    const form = html.match(/<form\b[^>]*data-ozmo-form=[^>]*>/i)?.[0] ?? '';
    const submitButton = html.match(/<button\b[^>]*data-enhanced-submit[^>]*>/i)?.[0] ?? '';
    assert.doesNotMatch(form, /\bnovalidate\b/i, `${page} should preserve native validation before JavaScript runs`);
    assert.match(form, /\bmethod=["']post["']/i, `${page} should use POST when JavaScript is unavailable`);
    assert.match(form, /\baction=["']["']/i, `${page} should keep no-JavaScript form data on the current page until a production endpoint is configured`);
    assert.doesNotMatch(form, /\baction=["']mailto:/i, `${page} should not expose form data in a mailto URL or guess a recipient`);
    assert.match(submitButton, /\btype=["']button["']/i, `${page} should not expose a native submit control before JavaScript runs`);
    assert.match(submitButton, /\bdisabled\b/i, `${page} should keep the source submission control disabled without JavaScript`);
    assert.match(html, /<p class="form-status"[^>]*role="status"/i, `${page} status should have status semantics`);
    assert.match(html, /<p class="error-message"[^>]*role="alert"/i, `${page} errors should have alert semantics`);
  }
});

test('enhanceForms activates marked submit controls only after JavaScript loads', () => {
  const enhancedSubmit = { type: 'button', disabled: true };
  const attributes = new Map();
  const listeners = new Map();
  const form = {
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    querySelectorAll(selector) {
      assert.equal(selector, '[data-enhanced-submit]');
      return [enhancedSubmit];
    },
    addEventListener(name, listener) {
      listeners.set(name, listener);
    },
  };
  const documentRef = {
    querySelectorAll(selector) {
      assert.equal(selector, '[data-ozmo-form]');
      return [form];
    },
  };

  formModule.OZMOForms.enhanceForms(documentRef);

  assert.equal(attributes.get('novalidate'), '');
  assert.equal(enhancedSubmit.type, 'submit');
  assert.equal(enhancedSubmit.disabled, false);
  assert.equal(typeof listeners.get('submit'), 'function');
});

test('enhanced form submissions mark the form pending and disable the submit control', () => {
  const siteJs = fs.readFileSync(path.join(conceptRoot, 'assets/js/site.js'), 'utf8');
  assert.match(siteJs, /form\.dataset\.submitting\s*===\s*['"]true['"]/);
  assert.match(siteJs, /form\.dataset\.submitting\s*=\s*['"]true['"]/);
  assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*true/);
  assert.match(siteJs, /delete form\.dataset\.submitting/);
  assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*false/);
});

test('concept 2 exports static form endpoints and validation helpers', () => {
  assert.deepEqual(concept2Module.FORM_ENDPOINTS, { audit: '', contact: '' });
  assert.equal(typeof concept2Module.OZMOForms.validateFields, 'function');
  assert.equal(typeof concept2Module.OZMOForms.formDataToObject, 'function');
});

test('concept 2 source forms keep no-JavaScript submission explicitly unavailable', () => {
  for (const page of ['site-audit.html', 'contact.html']) {
    const html = fs.readFileSync(path.join(concept2Root, page), 'utf8');
    const form = html.match(/<form\b[^>]*data-ozmo-form=[^>]*>/i)?.[0] ?? '';
    const submitButton = html.match(/<button\b[^>]*data-enhanced-submit[^>]*>/i)?.[0] ?? '';
    assert.doesNotMatch(form, /\bnovalidate\b/i, `${page} should preserve native validation before JavaScript runs`);
    assert.match(form, /\bmethod=["']post["']/i, `${page} should use POST when JavaScript is unavailable`);
    assert.match(form, /\baction=["']["']/i, `${page} should keep no-JavaScript form data on the current page until a production endpoint is configured`);
    assert.doesNotMatch(form, /\baction=["']mailto:/i, `${page} should not expose form data in a mailto URL or guess a recipient`);
    assert.match(submitButton, /\btype=["']button["']/i, `${page} should not expose a native submit control before JavaScript runs`);
    assert.match(submitButton, /\bdisabled\b/i, `${page} should keep the source submission control disabled without JavaScript`);
    assert.match(html, /<p class="form-status"[^>]*role="status"/i, `${page} status should have status semantics`);
    assert.match(html, /<p class="error-message"[^>]*role="alert"/i, `${page} errors should have alert semantics`);
  }
});

test('concept 2 enhancement creates a mobile navigation control from its source navigation', () => {
  const classes = new Set();
  const attributes = new Map();
  const nav = {
    id: '',
    classList: { add(name) { classes.add(name); } },
  };
  const header = {
    insertBefore(node, reference) {
      this.inserted = { node, reference };
    },
  };
  const documentClasses = new Set();
  const documentRef = {
    documentElement: { classList: { add(name) { documentClasses.add(name); } } },
    querySelector(selector) {
      if (selector === '.site-header nav[aria-label="Primary navigation"]') return nav;
      if (selector === '.site-header') return header;
      return null;
    },
    createElement(tagName) {
      assert.equal(tagName, 'button');
      return {
        className: '',
        setAttribute(name, value) { attributes.set(name, value); },
        addEventListener() {},
      };
    },
  };

  concept2Module.OZMOForms.enhanceNavigation(documentRef);

  assert.ok(documentClasses.has('js'));
  assert.equal(nav.id, 'nav-menu');
  assert.ok(classes.has('nav-menu'));
  assert.equal(header.inserted.reference, nav);
  assert.equal(header.inserted.node.className, 'nav-toggle');
  assert.equal(header.inserted.node.type, 'button');
  assert.equal(header.inserted.node.textContent, 'Menu');
  assert.equal(attributes.get('aria-expanded'), 'false');
  assert.equal(attributes.get('aria-controls'), 'nav-menu');
});
