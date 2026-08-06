document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-nav-toggle]");
  if (!toggle) return;

  const nav = document.querySelector("[data-nav-links]");
  if (!nav) return;

  const isOpen = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-nav-links] a");
  if (!link) return;

  const nav = document.querySelector("[data-nav-links]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (nav) nav.classList.remove("is-open");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-static-form]");
  if (!form) return;

  event.preventDefault();
  const message = form.querySelector("[data-form-message]");
  if (message) {
    message.textContent = "Thanks. Your audit request is ready for the OZMO follow-up workflow.";
    message.hidden = false;
  }
});
