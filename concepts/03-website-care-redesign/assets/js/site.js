(function (root) {
  const FORM_ENDPOINTS = { audit: '', contact: '' };
  const OZMOForms = {};
  if (typeof module !== 'undefined' && module.exports) module.exports = { FORM_ENDPOINTS, OZMOForms };
  root.FORM_ENDPOINTS = FORM_ENDPOINTS;
  root.OZMOForms = OZMOForms;
}(typeof window !== 'undefined' ? window : globalThis));
