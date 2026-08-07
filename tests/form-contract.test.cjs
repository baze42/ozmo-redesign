const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const formModule = require(path.resolve(__dirname, '../concepts/01-digital-operations-partner/assets/js/site.js'));
const conceptRoot = path.resolve(__dirname, '../concepts/01-digital-operations-partner');
const concept2Module = require(path.resolve(__dirname, '../concepts/02-local-growth-studio/assets/js/site.js'));
const concept2Root = path.resolve(__dirname, '../concepts/02-local-growth-studio');
const concept3Module = require(path.resolve(__dirname, '../concepts/03-website-care-redesign/assets/js/site.js'));
const concept3Root = path.resolve(__dirname, '../concepts/03-website-care-redesign');
const formConcepts = [
  { label: 'Concept 1', module: formModule, root: conceptRoot },
  { label: 'Concept 2', module: concept2Module, root: concept2Root },
  { label: 'Concept 3', module: concept3Module, root: concept3Root },
];

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

test('concept 3 source forms keep no-JavaScript submission explicitly unavailable', () => {
  for (const page of ['site-audit.html', 'contact.html']) {
    const html = fs.readFileSync(path.join(concept3Root, page), 'utf8');
    const form = html.match(/<form\b[^>]*data-ozmo-form=[^>]*>/i)?.[0] ?? '';
    const submitButton = html.match(/<button\b[^>]*data-enhanced-submit[^>]*>/i)?.[0] ?? '';
    assert.doesNotMatch(form, /\bnovalidate\b/i, `${page} should preserve native validation before JavaScript runs`);
    assert.match(form, /\bmethod=["']post["']/i, `${page} should use POST when JavaScript is unavailable`);
    assert.match(form, /\baction=["']["']/i, `${page} should keep no-JavaScript form data on the current page until a production endpoint is configured`);
    assert.doesNotMatch(form, /\baction=["']mailto:/i, `${page} should not expose form data in a mailto URL or guess a recipient`);
    assert.match(submitButton, /\btype=["']button["']/i, `${page} should not expose a native submit control before JavaScript runs`);
    assert.match(submitButton, /\bdisabled\b/i, `${page} should keep the source submission control disabled without JavaScript`);
    assert.match(html, /<p\b[^>]*class="form-status"[^>]*role="status"/i, `${page} status should have status semantics`);
    assert.match(html, /<p\b[^>]*class="error-message"[^>]*role="alert"/i, `${page} errors should have alert semantics`);
  }
});

test('concept 2 enhanced forms announce combined validation errors in the form-level error region', async () => {
  const listeners = new Map();
  const values = { name: '', email: 'invalid-email' };
  const fieldErrors = [
    { getAttribute: () => 'name', textContent: '' },
    { getAttribute: () => 'email', textContent: '' },
  ];
  const formError = { textContent: '' };
  const status = { textContent: '' };
  const fields = [
    { name: 'name', type: 'text', id: 'name', getAttribute: (name) => name === 'data-label' ? 'Name' : null, hasAttribute: (name) => name === 'required' },
    { name: 'email', type: 'email', id: 'email', getAttribute: (name) => name === 'data-label' ? 'Email' : null, hasAttribute: (name) => name === 'required' },
  ];
  const form = {
    dataset: {},
    setAttribute() {},
    getAttribute: () => 'audit',
    querySelectorAll(selector) {
      if (selector === '[data-enhanced-submit]') return [];
      if (selector === '[data-field]') return fields;
      if (selector === '[data-error-for]') return fieldErrors;
      if (selector === '[data-form-error]') return [formError];
      throw new Error(`Unexpected selector: ${selector}`);
    },
    querySelector(selector) {
      if (selector === '[data-form-status]') return status;
      if (selector === '[type="submit"]') return null;
      return null;
    },
    addEventListener(name, listener) { listeners.set(name, listener); },
    reset() {},
  };
  const documentRef = { querySelectorAll: () => [form] };
  const originalFormData = globalThis.FormData;
  const originalSetTimeout = globalThis.setTimeout;
  globalThis.FormData = class {
    entries() { return Object.entries(values)[Symbol.iterator](); }
  };
  globalThis.setTimeout = (callback) => { callback(); return 0; };

  try {
    concept2Module.OZMOForms.enhanceForms(documentRef);
    await listeners.get('submit')({ preventDefault() {} });

    assert.equal(fieldErrors[0].textContent, 'Name is required.');
    assert.equal(fieldErrors[1].textContent, 'Enter a valid email address.');
    assert.equal(formError.textContent, 'Name is required. Enter a valid email address.');
    assert.equal(status.textContent, '');

    values.name = 'Pat Owner';
    values.email = 'pat@example.com';
    await listeners.get('submit')({ preventDefault() {} });
    assert.equal(formError.textContent, '');
  } finally {
    globalThis.FormData = originalFormData;
    globalThis.setTimeout = originalSetTimeout;
  }
});

test('concept 3 enhanced forms render errors and keep static submissions network-free', async () => {
  const listeners = new Map();
  const values = { name: '', email: 'invalid-email' };
  const fieldErrors = [
    { getAttribute: () => 'name', textContent: '' },
    { getAttribute: () => 'email', textContent: '' },
  ];
  const formError = { textContent: '' };
  const status = { textContent: '' };
  const classes = new Set();
  const button = {
    disabled: false,
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
    },
    setAttribute() {},
  };
  const fields = [
    { name: 'name', type: 'text', id: 'name', getAttribute: (name) => name === 'data-label' ? 'Name' : null, hasAttribute: (name) => name === 'required' },
    { name: 'email', type: 'email', id: 'email', getAttribute: (name) => name === 'data-label' ? 'Email' : null, hasAttribute: (name) => name === 'required' },
  ];
  let resetCalls = 0;
  const form = {
    dataset: {},
    setAttribute() {},
    getAttribute: () => 'audit',
    querySelectorAll(selector) {
      if (selector === '[data-enhanced-submit]') return [];
      if (selector === '[data-field]') return fields;
      if (selector === '[data-error-for]') return fieldErrors;
      if (selector === '[data-form-error]') return [formError];
      throw new Error(`Unexpected selector: ${selector}`);
    },
    querySelector(selector) {
      if (selector === '[data-form-status]') return status;
      if (selector === '[type="submit"]') return button;
      return null;
    },
    addEventListener(name, listener) { listeners.set(name, listener); },
    reset() { resetCalls += 1; },
  };
  const documentRef = { querySelectorAll: () => [form] };
  const originalFormData = globalThis.FormData;
  const originalSetTimeout = globalThis.setTimeout;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.FormData = class {
    entries() { return Object.entries(values)[Symbol.iterator](); }
  };
  globalThis.setTimeout = (callback) => { callback(); return 0; };
  globalThis.fetch = async () => { fetchCalls += 1; };

  try {
    concept3Module.OZMOForms.enhanceForms(documentRef);
    await listeners.get('submit')({ preventDefault() {} });

    assert.equal(fieldErrors[0].textContent, 'Name is required.');
    assert.equal(fieldErrors[1].textContent, 'Enter a valid email address.');
    assert.equal(formError.textContent, 'Name is required. Enter a valid email address.');
    assert.equal(status.textContent, '');
    assert.equal(fetchCalls, 0);

    values.name = 'Pat Owner';
    values.email = 'pat@example.com';
    await listeners.get('submit')({ preventDefault() {} });

    assert.equal(formError.textContent, '');
    assert.equal(fetchCalls, 0, 'static forms should not issue network requests');
    assert.equal(resetCalls, 1);
    assert.equal(button.disabled, false);
    assert.ok(!classes.has('is-loading'));
  } finally {
    globalThis.FormData = originalFormData;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.fetch = originalFetch;
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

test('all concept form modules expose equivalent validation and serialization behavior', () => {
  for (const concept of formConcepts) {
    const invalid = concept.module.OZMOForms.validateFields(
      [
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'website', label: 'Website URL', required: false, type: 'url' },
      ],
      { name: '', email: 'not-an-email', website: 'not-a-url' }
    );
    assert.equal(invalid.valid, false, `${concept.label} should reject invalid required/email/URL values`);
    assert.equal(invalid.errors.name, 'Name is required.');
    assert.equal(invalid.errors.email, 'Enter a valid email address.');
    assert.equal(invalid.errors.website, 'Enter a valid URL that starts with http:// or https://.');

    const valid = concept.module.OZMOForms.validateFields(
      [
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'website', label: 'Website URL', required: true, type: 'url' },
      ],
      { name: 'Pat Owner', email: 'pat@example.com', website: 'https://example.com' }
    );
    assert.equal(valid.valid, true, `${concept.label} should accept complete valid values`);
    assert.deepEqual(valid.errors, {});

    const formData = new FormData();
    formData.append('services', 'Website support');
    formData.append('services', 'Lead follow-up');
    assert.deepEqual(concept.module.OZMOForms.formDataToObject(formData), {
      services: ['Website support', 'Lead follow-up'],
    }, `${concept.label} should preserve repeated form values as arrays`);
    assert.deepEqual(concept.module.FORM_ENDPOINTS, { audit: '', contact: '' }, `${concept.label} should default to static no-network endpoints`);
  }
});

test('all concept form modules guard pending submissions and restore controls', () => {
  for (const concept of formConcepts) {
    const siteJs = fs.readFileSync(path.join(concept.root, 'assets/js/site.js'), 'utf8');
    assert.match(siteJs, /form\.dataset\.submitting\s*===\s*['"]true['"]/, `${concept.label} should ignore repeated pending submissions`);
    assert.match(siteJs, /form\.dataset\.submitting\s*=\s*['"]true['"]/, `${concept.label} should mark pending submissions`);
    assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*true/, `${concept.label} should disable submit controls while pending`);
    assert.match(siteJs, /delete form\.dataset\.submitting/, `${concept.label} should clear pending state after submission`);
    assert.match(siteJs, /if \(button\) button\.disabled\s*=\s*false/, `${concept.label} should restore submit controls after submission`);
  }
});
