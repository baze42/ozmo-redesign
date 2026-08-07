(function (root, factory) {
  const api = factory(root);
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.OZMOForms = api.OZMOForms;
  root.FORM_ENDPOINTS = api.FORM_ENDPOINTS;
}(typeof window !== 'undefined' ? window : globalThis, function (root) {
  const FORM_ENDPOINTS = {
    audit: '',
    contact: '',
  };

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  function isUrl(value) {
    if (!value) return true;
    try {
      const parsed = new root.URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_error) {
      return false;
    }
  }

  function validateFields(fields, values) {
    const errors = {};
    for (const field of fields) {
      const rawValue = values[field.name];
      const value = String(Array.isArray(rawValue) ? rawValue[0] : rawValue || '').trim();
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required.`;
        continue;
      }
      if (field.type === 'email' && value && !isEmail(value)) {
        errors[field.name] = 'Enter a valid email address.';
      }
      if (field.type === 'url' && value && !isUrl(value)) {
        errors[field.name] = 'Enter a valid URL that starts with http:// or https://.';
      }
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }

  function formDataToObject(formData) {
    const values = {};
    for (const [name, value] of formData.entries()) {
      if (!(name in values)) {
        values[name] = value;
      } else if (Array.isArray(values[name])) {
        values[name].push(value);
      } else {
        values[name] = [values[name], value];
      }
    }
    return values;
  }

  async function submitForm(form, options = {}) {
    const endpoint = options.endpoint || '';
    if (!endpoint) {
      await new Promise((resolve) => root.setTimeout(resolve, 250));
      return { ok: true, staticMode: true };
    }
    const response = await root.fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formDataToObject(new root.FormData(form))),
    });
    if (!response.ok) {
      throw new Error('Form submission failed.');
    }
    return { ok: true, staticMode: false };
  }

  function renderErrors(form, errors) {
    for (const message of form.querySelectorAll('[data-error-for]')) {
      const name = message.getAttribute('data-error-for');
      message.textContent = errors[name] || '';
    }
    const summary = Object.values(errors).join(' ');
    for (const message of form.querySelectorAll('[data-form-error]')) {
      message.textContent = summary;
    }
  }

  function labelFor(form, field) {
    if (field.getAttribute('data-label')) return field.getAttribute('data-label');
    const label = Array.from(form.querySelectorAll('label')).find((item) => item.htmlFor === field.id);
    return label ? label.textContent.trim() : field.name;
  }

  function fieldsFor(form) {
    const markedFields = form.querySelectorAll('[data-field]');
    const controls = markedFields.length ? markedFields : form.querySelectorAll('input, select, textarea');
    return Array.from(controls)
      .filter((element) => element.name && !['button', 'submit', 'reset', 'checkbox', 'radio'].includes(element.type))
      .map((element) => ({
        name: element.name,
        label: labelFor(form, element),
        required: element.hasAttribute('required'),
        type: element.getAttribute('data-validate') || element.type,
      }));
  }

  async function runSubmit(form, endpoint) {
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    form.dataset.submitting = 'true';
    if (button) button.disabled = true;
    button?.classList.add('is-loading');
    button?.setAttribute('aria-busy', 'true');
    if (status) status.textContent = 'Sending your request...';
    try {
      const result = await submitForm(form, { endpoint });
      if (status) {
        status.textContent = result.staticMode
          ? 'Your request is ready for review. Connect a form endpoint when you are ready to receive live submissions.'
          : 'Thanks. OZMO will review your request and follow up with the next best step.';
      }
      form.reset();
    } catch (_error) {
      if (status) status.textContent = 'Something went wrong. Please try again or contact OZMO directly.';
    } finally {
      delete form.dataset.submitting;
      if (button) button.disabled = false;
      button?.classList.remove('is-loading');
      button?.setAttribute('aria-busy', 'false');
    }
  }

  function enhanceForms(documentRef) {
    const forms = Array.from(documentRef.querySelectorAll('[data-ozmo-form]'));
    for (const form of forms) {
      form.setAttribute('novalidate', '');
      for (const button of form.querySelectorAll('[data-enhanced-submit]')) {
        button.type = 'submit';
        button.disabled = false;
      }
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (form.dataset.submitting === 'true') return;
        const type = form.getAttribute('data-ozmo-form');
        const result = validateFields(fieldsFor(form), formDataToObject(new root.FormData(form)));
        renderErrors(form, result.errors);
        const status = form.querySelector('[data-form-status]');
        if (status) status.textContent = '';
        if (!result.valid) return;
        await runSubmit(form, FORM_ENDPOINTS[type] || '');
      });
    }
  }

  function enhanceNavigation(documentRef) {
    documentRef.documentElement.classList.add('js');
    const toggle = documentRef.querySelector('.nav-toggle');
    let menu = documentRef.querySelector('#nav-menu');
    let navigationToggle = toggle;
    if (!menu) {
      const header = documentRef.querySelector('.site-header');
      menu = documentRef.querySelector('.site-header nav[aria-label="Primary navigation"]');
      if (!header || !menu) return;
      menu.id = 'nav-menu';
      menu.classList.add('nav-menu');
      navigationToggle = documentRef.createElement('button');
      navigationToggle.className = 'nav-toggle';
      navigationToggle.type = 'button';
      navigationToggle.textContent = 'Menu';
      navigationToggle.setAttribute('aria-expanded', 'false');
      navigationToggle.setAttribute('aria-controls', 'nav-menu');
      header.insertBefore(navigationToggle, menu);
    }
    if (navigationToggle && menu) {
      navigationToggle.addEventListener('click', () => {
        const expanded = navigationToggle.getAttribute('aria-expanded') === 'true';
        navigationToggle.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('is-open', !expanded);
      });
    }
  }

  if (root.document) {
    enhanceNavigation(root.document);
    enhanceForms(root.document);
  }

  return {
    FORM_ENDPOINTS,
    OZMOForms: { validateFields, formDataToObject, submitForm, enhanceForms, enhanceNavigation },
  };
}));
