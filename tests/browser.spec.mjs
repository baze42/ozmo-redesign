import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conceptPath = '/concepts/01-digital-operations-partner';
const conceptRoot = path.join(repoRoot, conceptPath);
const pages = ['index.html', 'services.html', 'site-audit.html', 'about.html', 'insights.html', 'contact.html'];
let server;
let baseUrl;

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (file.endsWith('.webp')) return 'image/webp';
  if (file.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

async function gotoPage(page, name) {
  await page.goto(`${baseUrl}${conceptPath}/${name}`, { waitUntil: 'networkidle' });
}

async function settleForScreenshot(page) {
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function completeAudit(page) {
  await page.getByLabel('Name').fill('Pat Owner');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('pat@example.com');
  await page.getByLabel('Company').fill('Pat Services');
  await page.getByLabel('Website URL').fill('https://example.com');
  await page.getByLabel('What feels hardest right now?').fill('The website is dated and follow-up is hard to track.');
  await page.getByLabel('Timeline').selectOption({ label: 'In the next 30 days' });
  await page.getByLabel('Notes').fill('Please review service pages and lead capture.');
}

test.beforeAll(async () => {
  server = http.createServer((request, response) => {
    const requested = new URL(request.url, 'http://127.0.0.1').pathname;
    const file = path.resolve(repoRoot, `.${decodeURIComponent(requested)}`);
    if (!file.startsWith(repoRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { 'Content-Type': contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.afterAll(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

for (const width of [390, 1440]) {
  test(`concept pages do not horizontally overflow at ${width}px over HTTP`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const name of pages) {
      await gotoPage(page, name);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `${name} should not overflow at ${width}px`).toBe(false);
    }
  });
}

test('navigation works over local HTTP and exposes a keyboard focus indicator', async ({ page }) => {
  await gotoPage(page, 'index.html');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.getByRole('link', { name: 'Services', exact: true }).first().click();
  await expect(page).toHaveURL(/services\.html$/);
  await expect(page.getByRole('heading', { name: /connected digital support/i })).toBeVisible();
});

test('mobile navigation and native contact validation remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await gotoPage(page, 'contact.html');
  await expect(page.getByRole('link', { name: 'Services', exact: true }).first()).toBeVisible();
  const form = page.locator('[data-ozmo-form="contact"]');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('action', /^mailto:/);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect.poll(() => form.evaluate((element) => element.matches(':invalid'))).toBe(true);
  await context.close();
});

test('configured endpoint failures show an in-page error state', async ({ page }) => {
  await page.route('**/configured-endpoint', async (route) => {
    await route.fulfill({ status: 500, body: 'Nope' });
  });
  await gotoPage(page, 'site-audit.html');
  await page.evaluate(() => { window.FORM_ENDPOINTS.audit = '/configured-endpoint'; });
  await completeAudit(page);
  await page.getByRole('button', { name: /request a site audit/i }).click();
  await expect(page.getByRole('status')).toContainText(/something went wrong/i);
});

test('configured submissions stay single-flight when a keyboard submit is repeated', async ({ page }) => {
  let submissions = 0;
  await page.route('**/configured-endpoint', async (route) => {
    submissions += 1;
    await new Promise((resolve) => setTimeout(resolve, 150));
    await route.fulfill({ status: 200, body: '{}' });
  });
  await gotoPage(page, 'site-audit.html');
  await page.evaluate(() => { window.FORM_ENDPOINTS.audit = '/configured-endpoint'; });
  await completeAudit(page);
  const submit = page.getByRole('button', { name: /request a site audit/i });
  await submit.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText(/thanks/i);
  expect(submissions).toBe(1);
});

test('settled desktop and mobile screenshots can be captured over local HTTP', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await gotoPage(page, 'index.html');
  await settleForScreenshot(page);
  await page.screenshot({ path: path.join(repoRoot, 'artifacts/screenshots/concept-1-home-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await gotoPage(page, 'index.html');
  await settleForScreenshot(page);
  await page.screenshot({ path: path.join(repoRoot, 'artifacts/screenshots/concept-1-home-mobile.png'), fullPage: true });
});
