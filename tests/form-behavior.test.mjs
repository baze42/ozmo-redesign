import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

function loadDom() {
  const dom = new JSDOM(readFileSync("index.html", "utf8"), {
    runScripts: "outside-only",
    url: "https://ozmodigital.test/"
  });
  const script = readFileSync("script.js", "utf8");
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded", { bubbles: true }));
  return dom;
}

test("validateForm returns field-level messages for missing required fields and invalid email", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector("#email").value = "not-an-email";

  const result = window.OzmoAudit.validateForm(form);

  assert.equal(result.valid, false);
  assert.equal(result.errors.name, "Please enter your name.");
  assert.equal(result.errors.email, "Please enter a valid email address.");
  assert.equal(result.errors.business, "Please enter your business name.");
  assert.equal(result.errors.challenge, "Please share the biggest digital challenge.");
});

test("validateForm accepts an empty website but rejects an invalid populated URL", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector("#name").value = "Alex Rivera";
  form.querySelector("#email").value = "alex@example.com";
  form.querySelector("#business").value = "Rivera Studio";
  form.querySelector("#challenge").value = "Follow-up is inconsistent.";

  assert.equal(window.OzmoAudit.validateForm(form).valid, true);

  form.querySelector("#website").value = "not a website";
  const result = window.OzmoAudit.validateForm(form);

  assert.equal(result.valid, false);
  assert.equal(result.errors.website, "Please enter a valid website URL.");
});

test("failed submit associates errors, marks invalid controls, and focuses the first invalid field", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  for (const field of ["name", "email", "business", "challenge"]) {
    const control = form.elements[field];
    const error = window.document.querySelector(`#${field}-error`);
    assert.equal(control.getAttribute("aria-describedby"), error.id);
    assert.equal(control.getAttribute("aria-invalid"), "true");
    assert.notEqual(error.textContent, "");
  }
  assert.equal(window.document.activeElement, form.elements.name);
});

test("subsequent validation clears aria-invalid from corrected controls", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  form.elements.name.value = "Alex Rivera";
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  assert.equal(form.elements.name.hasAttribute("aria-invalid"), false);
  assert.equal(window.document.querySelector("#name-error").textContent, "");
});

test("getSelectedServices returns checked service values in document order", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector('input[value="Website design"]').checked = true;
  form.querySelector('input[value="Automation"]').checked = true;

  assert.deepEqual(Array.from(window.OzmoAudit.getSelectedServices(form)), ["Website design", "Automation"]);
});

test("valid submit shows a consultative success state without navigation", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector("#name").value = "Alex Rivera";
  form.querySelector("#email").value = "alex@example.com";
  form.querySelector("#business").value = "Rivera Studio";
  form.querySelector("#challenge").value = "Leads arrive from several places and follow-up is inconsistent.";

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  assert.match(window.document.querySelector("[data-form-status]").textContent, /Thanks, Alex/);
  assert.equal(form.dataset.submitted, "true");
});
