import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const siteUrl = pathToFileURL(path.resolve("index.html")).toString();
const errorsByPage = new WeakMap();

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
  await expect(page.locator("#audit-form")).toBeInViewport();
});

test("hero audit CTA reaches the audit form", async ({ page }) => {
  await page.locator(".hero-actions").getByRole("link", { name: "Request Your Digital Growth Audit" }).click();
  await expect(page.locator("#audit-form")).toBeInViewport();
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

test("responsive layout does not create horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
