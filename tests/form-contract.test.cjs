const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const formModule = require(path.resolve(__dirname, '../concepts/01-digital-operations-partner/assets/js/site.js'));

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
