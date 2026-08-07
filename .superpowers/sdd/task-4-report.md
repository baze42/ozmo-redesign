# Task 4 Report: Form Validation, Configurable Endpoint, And No-Network Static Mode

## RED Evidence

Command:

```sh
node --test tests/form-contract.test.cjs
```

Result: failed before implementation with `ReferenceError: document is not defined` while requiring `assets/js/site.js`. This confirmed the Task 2 browser-only navigation script did not export the required form API for Node contract tests.

The updated progressive-enhancement content contract was also run before markup changes:

```sh
node --test tests/content-contract.test.mjs
```

Result: 8 passed, 1 failed. The expected failure was `site-audit.html should opt into OZMO form behavior` because the forms did not yet have `data-ozmo-form` or submit behavior.

## GREEN Evidence

Commands:

```sh
node --test tests/form-contract.test.cjs tests/content-contract.test.mjs tests/static-contract.test.mjs tests/style-contract.test.mjs
npm test
```

Results:

- Targeted form, content, static, and style suite: 25 passed, 0 failed.
- `npm test`: 25 passed, 0 failed.
- `git diff --check`: no whitespace errors.

## Files Changed

- `concepts/01-digital-operations-partner/assets/js/site.js`
- `concepts/01-digital-operations-partner/site-audit.html`
- `concepts/01-digital-operations-partner/contact.html`
- `tests/form-contract.test.cjs`
- `tests/content-contract.test.mjs`

## Implementation Summary

- Exported `OZMOForms` and empty-by-default `FORM_ENDPOINTS` for browser and Node use.
- Added required, email, and optional URL validation; static submission mode never calls `fetch` when no endpoint is configured.
- Added loading, success, and configured-endpoint error states while retaining mobile navigation behavior.
- Converted both forms to progressively enhanced submit forms and added labels, per-field accessible error messages, and form-level live status messages.

## Self-Review

- Confirmed endpoints remain `{ audit: '', contact: '' }`.
- Confirmed static mode returns success without evaluating `fetch`.
- Confirmed configured non-OK or rejected requests reach the form error status through `runSubmit`.
- Confirmed both form submit handlers call `preventDefault`, so native navigation does not occur when JavaScript is available.
- Confirmed the content contract was advanced from the intentionally temporary Task 2 inert-button expectation to Task 4 progressive-enhancement expectations.

## Concerns

None. No live endpoint is configured by design; configured-endpoint network behavior is handled but not exercised against a real service.

## Fix: Preserve Repeated Form Values

### RED Evidence

Added a focused contract test for repeated `services` fields:

```sh
node --test tests/form-contract.test.cjs
```

Result: 3 passed, 1 failed. The new test failed with `TypeError: formModule.OZMOForms.formDataToObject is not a function`, confirming the helper was not yet exported.

### GREEN Evidence

Commands:

```sh
node --test tests/form-contract.test.cjs tests/content-contract.test.mjs tests/static-contract.test.mjs tests/style-contract.test.mjs
npm test
git diff --check
```

Results:

- Targeted form, content, static, and style suite: 26 passed, 0 failed.
- `npm test`: 26 passed, 0 failed.
- `git diff --check`: no whitespace errors.

### Files Changed

- `concepts/01-digital-operations-partner/assets/js/site.js`
- `tests/form-contract.test.cjs`
- `.superpowers/sdd/task-4-report.md`

### Self-Review

- `formDataToObject` leaves single values as strings and promotes repeated names to arrays in encounter order.
- Configured endpoint submissions now serialize through `formDataToObject` instead of `Object.fromEntries`.
- The helper is exported under `OZMOForms` for direct contract coverage and reuse.
- Existing static-mode behavior and all prior contract tests remain green.

### Concerns

None. No live endpoint is configured by design; the repeated-value payload behavior is covered by the focused unit contract.

## Fix: Hide Empty Form Live Regions

### RED Evidence

Added focused style assertions requiring empty `.error-message` and `.form-status` live regions to use `display: none`:

```sh
node --test tests/style-contract.test.mjs
```

Result: 4 passed, 1 failed. The new `CSS hides empty form live regions` test failed because neither empty-state selector existed in the stylesheet.

### GREEN Evidence

Commands:

```sh
node --test tests/form-contract.test.cjs tests/content-contract.test.mjs tests/static-contract.test.mjs tests/style-contract.test.mjs
npm test
git diff --check
```

Results:

- Targeted form, content, static, and style suite: 27 passed, 0 failed.
- `npm test`: 27 passed, 0 failed.
- `git diff --check`: no whitespace errors.

### Files Changed

- `concepts/01-digital-operations-partner/assets/css/styles.css`
- `tests/style-contract.test.mjs`
- `.superpowers/sdd/task-4-report.md`

### Self-Review

- Empty `.form-status` and `.error-message` elements are removed from layout with `display: none`.
- Populated live regions retain the existing shared padding and border radius plus their existing status/error colors.
- The style contract directly guards both selectors against regression.

### Concerns

None.
