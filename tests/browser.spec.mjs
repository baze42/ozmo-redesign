import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const siteUrl = pathToFileURL(path.resolve("index.html")).toString();
const errorsByPage = new WeakMap();

async function expectAuditFormBelowHeader(page) {
  await expect(page.locator("#audit-form")).toBeInViewport();
  await page.locator("#audit-form").evaluate(() => new Promise((resolve) => {
    let previousScrollY = window.scrollY;
    let stableFrames = 0;

    function waitForScrollEnd() {
      if (Math.abs(window.scrollY - previousScrollY) < 1) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
      previousScrollY = window.scrollY;

      if (stableFrames >= 3) resolve();
      else requestAnimationFrame(waitForScrollEnd);
    }

    requestAnimationFrame(waitForScrollEnd);
  }));
  await expect.poll(async () => {
    return page.evaluate(() => {
      const formRect = document.querySelector("#audit-form").getBoundingClientRect();
      const headerRect = document.querySelector("[data-header]").getBoundingClientRect();
      return formRect.top >= headerRect.bottom;
    });
  }).toBe(true);
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  errorsByPage.set(page, errors);
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(siteUrl);
});

test.afterEach(async ({ page }) => {
  expect(errorsByPage.get(page)).toEqual([]);
});

test("renders the approved hero and audit CTA", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /digital presence should bring clarity/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Request Your Digital Growth Audit" }).first()).toBeVisible();
  await expect(page.getByAltText("Ozmo Digital").first()).toBeVisible();
});

test("anchor navigation reaches the audit form", async ({ page }) => {
  await page.getByRole("link", { name: "Audit" }).first().click();
  await expectAuditFormBelowHeader(page);
});

test("hero audit CTA reaches the audit form", async ({ page }) => {
  await page.locator(".hero-actions").getByRole("link", { name: "Request Your Digital Growth Audit" }).click();
  await expectAuditFormBelowHeader(page);
});

test("section navigation updates the URL fragment", async ({ page }) => {
  await page.getByRole("link", { name: "Pain Points" }).click();
  await expect(page).toHaveURL(/#problem$/);
});

test("audit form validates and shows success without navigation", async ({ page }) => {
  await page.locator("#audit-form").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Request Your Digital Growth Audit" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await page.locator("#name").fill("Alex Rivera");
  await page.locator("#email").fill("alex@example.com");
  await page.locator("#business").fill("Rivera Studio");
  await page.locator("#challenge").fill("Our leads arrive from several places and follow-up is inconsistent.");
  await page.getByLabel("Automation").check();
  await page.getByRole("button", { name: "Request Your Digital Growth Audit" }).click();

  await expect(page.locator("[data-form-status]")).toContainText("Thanks, Alex");
  await expect(page.locator("#audit-form")).toHaveAttribute("data-submitted", "true");
});

test("audit form rejects an invalid optional website URL", async ({ page }) => {
  await page.locator("#name").fill("Alex Rivera");
  await page.locator("#email").fill("alex@example.com");
  await page.locator("#business").fill("Rivera Studio");
  await page.locator("#website").fill("not a website");
  await page.locator("#challenge").fill("Our follow-up process is inconsistent.");
  await page.getByRole("button", { name: "Request Your Digital Growth Audit" }).click();

  await expect(page.locator("#website-error")).toHaveText("Please enter a valid website URL.");
  await expect(page.locator("#website")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#audit-form")).toHaveAttribute("data-submitted", "false");
});

test("responsive layout does not create horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
