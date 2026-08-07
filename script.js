(function () {
  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    business: "Please enter your business name.",
    challenge: "Please share the biggest digital challenge."
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateForm(form) {
    const errors = {};
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const business = form.elements.business.value.trim();
    const challenge = form.elements.challenge.value.trim();

    if (!name) errors.name = messages.name;
    if (!email || !isValidEmail(email)) errors.email = messages.email;
    if (!business) errors.business = messages.business;
    if (!challenge) errors.challenge = messages.challenge;

    return { valid: Object.keys(errors).length === 0, errors };
  }

  function getSelectedServices(form) {
    return Array.from(form.querySelectorAll('input[name="services"]:checked')).map((input) => input.value);
  }

  function renderErrors(form, errors) {
    form.querySelectorAll("[data-error-for]").forEach((node) => {
      const field = node.getAttribute("data-error-for");
      node.textContent = errors[field] || "";
    });
  }

  function handleAuditSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector("[data-form-status]");
    const result = validateForm(form);

    renderErrors(form, result.errors);

    if (!result.valid) {
      form.dataset.submitted = "false";
      status.textContent = "Please review the highlighted fields so we can understand your business clearly.";
      return;
    }

    const firstName = form.elements.name.value.trim().split(/\s+/)[0];
    const selectedServices = getSelectedServices(form);
    const serviceText = selectedServices.length
      ? ` We noted your interest in ${selectedServices.join(", ")}.`
      : "";

    form.dataset.submitted = "true";
    status.textContent = `Thanks, ${firstName}. Your audit request is ready for review.${serviceText}`;
    form.querySelector(".form-submit").textContent = "Audit Request Prepared";
  }

  function bindSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function init() {
    const form = document.querySelector("#audit-form");
    if (form) form.addEventListener("submit", handleAuditSubmit);
    bindSmoothAnchors();
  }

  window.OzmoAudit = { validateForm, getSelectedServices };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
