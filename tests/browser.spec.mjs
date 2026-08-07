import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conceptRoot = path.join(repoRoot, 'concepts', '01-digital-operations-partner');
const pages = ['index.html', 'services.html', 'site-audit.html', 'about.html', 'insights.html', 'contact.html'];

async function gotoPage(page, name) {
  await page.goto(`file://${path.join(conceptRoot, name)}`);
}

for (const width of [390, 1440]) {
  test(`concept pages do not horizontally overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const name of pages) {
      await gotoPage(page, name);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `${name} should not overflow at ${width}px`).toBe(false);
    }
  });
}

test('site audit form validates and submits in static mode without network', async ({ page }) => {
  const requests = [];
  await gotoPage(page, 'site-audit.html');
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: /request a site audit/i }).click();
  await expect(page.getByText('Name is required.')).toBeVisible();
  await page.getByLabel('Name').fill('Pat Owner');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('pat@example.com');
  await page.getByLabel('Company').fill('Pat Services');
  await page.getByLabel('Website URL').fill('https://example.com');
  await page.getByLabel('What feels hardest right now?').fill('The website is dated and follow-up is hard to track.');
  await page.getByLabel('Timeline').selectOption({ label: 'In the next 30 days' });
  await page.getByLabel('Notes').fill('Please review service pages and lead capture.');
  await page.getByRole('button', { name: /request a site audit/i }).click();
  await expect(page.getByText(/ready for review/i)).toBeVisible();
  expect(requests.filter((url) => url.startsWith('http'))).toHaveLength(0);
});

test('invalid submission clears a stale form status', async ({ page }) => {
  await gotoPage(page, 'site-audit.html');
  const status = page.locator('[data-form-status]');
  await status.evaluate((element) => {
    element.textContent = 'Your request is ready for review.';
  });
  await page.getByRole('button', { name: /request a site audit/i }).click();
  await expect(status).toBeEmpty();
});

test('desktop and mobile screenshots can be captured', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await gotoPage(page, 'index.html');
  await page.screenshot({ path: path.join(repoRoot, 'artifacts/screenshots/concept-1-home-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await gotoPage(page, 'index.html');
  await page.screenshot({ path: path.join(repoRoot, 'artifacts/screenshots/concept-1-home-mobile.png'), fullPage: true });
});
