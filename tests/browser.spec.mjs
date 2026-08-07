import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const concepts = [
  { name: 'Concept 1', path: '/concepts/01-digital-operations-partner', auditButton: /request a site audit/i, screenshotPrefix: 'concept-1-digital-operations' },
  { name: 'Concept 2', path: '/concepts/02-local-growth-studio', auditButton: /request a site audit/i, screenshotPrefix: 'concept-2-local-growth' },
];
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

async function gotoConceptPage(page, concept, name) {
  await page.goto(`${baseUrl}${concept.path}/${name}`, { waitUntil: 'networkidle' });
}

async function settleForScreenshot(page) {
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(async (image) => {
      image.loading = 'eager';
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }
      if (image.naturalWidth > 0) await image.decode();
    }));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function completeAudit(page, concept) {
  await page.getByLabel('Name').fill('Pat Owner');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('pat@example.com');
  await page.getByLabel('Company').fill('Pat Services');
  await page.getByLabel('Website URL').fill('https://example.com');
  const goalLabel = concept.name === 'Concept 2' ? 'What local growth goal matters most right now?' : 'What feels hardest right now?';
  await page.getByLabel(goalLabel).fill('The website is dated and follow-up is hard to track.');
  const timelineLabel = concept.name === 'Concept 2' ? 'Ready to start soon' : 'In the next 30 days';
  await page.getByLabel('Timeline').selectOption({ label: timelineLabel });
  await page.getByLabel('Notes').fill('Please review service pages and lead capture.');
}

async function completeContact(page, concept) {
  await page.getByLabel('Name').fill('Pat Owner');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('pat@example.com');
  await page.getByLabel('Company').fill('Pat Services');
  await page.getByLabel('Website URL').fill('https://example.com');
  const reasonLabel = concept.name === 'Concept 2' ? 'Not sure yet' : 'General question';
  await page.getByLabel('Reason for reaching out').selectOption({ label: reasonLabel });
  await page.getByLabel('Message').fill('I need help improving lead follow-up.');
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
  for (const concept of concepts) {
    test(`${concept.name} pages do not horizontally overflow at ${width}px over HTTP`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const name of pages) {
        await gotoConceptPage(page, concept, name);
        await expect(page, `${concept.name} ${name} should load from its own concept path`).toHaveURL(new RegExp(`${concept.path}/${name.replace('.', '\\.')}$`));
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        expect(overflow, `${concept.name} ${name} should not overflow at ${width}px`).toBe(false);
      }
    });
  }
}

test('navigation works over local HTTP and exposes a keyboard focus indicator', async ({ page }) => {
  await gotoConceptPage(page, concepts[0], 'index.html');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.getByRole('link', { name: 'Services', exact: true }).first().click();
  await expect(page).toHaveURL(/services\.html$/);
  await expect(page.getByRole('heading', { name: /connected digital support/i })).toBeVisible();
});

test('mobile navigation and contact fields remain available with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await gotoConceptPage(page, concepts[0], 'contact.html');
  await expect(page.getByRole('link', { name: 'Services', exact: true }).first()).toBeVisible();
  const form = page.locator('[data-ozmo-form="contact"]');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('action', '');
  await page.getByLabel('Name').focus();
  await expect.poll(() => form.evaluate((element) => element.matches(':invalid'))).toBe(true);
  await context.close();
});

for (const concept of concepts) {
  test(`${concept.name} valid no-JavaScript contact form cannot submit, navigate, or send data`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    const submissions = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' || request.resourceType() === 'fetch') submissions.push(request);
    });
    await gotoConceptPage(page, concept, 'contact.html');
    await expect(page).toHaveURL(new RegExp(`${concept.path}/contact\\.html$`));
    await completeContact(page, concept);
    const currentUrl = page.url();
    const submit = page.getByRole('button', { name: 'Send message' });
    await expect(submit).toBeDisabled();
    await expect(submit).toHaveAttribute('type', 'button');
    await submit.evaluate((button) => button.click());
    await page.waitForTimeout(100);
    await expect(page).toHaveURL(currentUrl);
    expect(submissions).toHaveLength(0);
    await context.close();
  });

  test(`${concept.name} enhanced static audit submissions show success, reset, and stay offline`, async ({ page }) => {
    await gotoConceptPage(page, concept, 'site-audit.html');
    await expect(page).toHaveURL(new RegExp(`${concept.path}/site-audit\\.html$`));
    const submissions = [];
    page.on('request', (request) => {
      if (request.method() === 'POST' || request.resourceType() === 'fetch') submissions.push(request);
    });
    await completeAudit(page, concept);
    await page.getByRole('button', { name: concept.auditButton }).click();
    await expect(page.getByRole('status')).toContainText(/ready for review/i);
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue('');
    await expect(page.getByLabel('Website URL')).toHaveValue('');
    const goalLabel = concept.name === 'Concept 2' ? 'What local growth goal matters most right now?' : 'What feels hardest right now?';
    await expect(page.getByLabel(goalLabel)).toHaveValue('');
    expect(submissions).toHaveLength(0);
  });

  test(`${concept.name} JavaScript-enabled mobile menu expands and follows its Services link`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoConceptPage(page, concept, 'index.html');
    await expect(page).toHaveURL(new RegExp(`${concept.path}/index\\.html$`));
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    const services = page.locator('#nav-menu').getByRole('link', { name: 'Services', exact: true });
    await expect(services).toBeVisible();
    await services.click();
    await expect(page).toHaveURL(new RegExp(`${concept.path}/services\\.html$`));
  });
}

test('mobile navigation remains visible if the enhancement script is unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.route('**/assets/js/site.js', async (route) => {
    await route.fulfill({ status: 404, body: '' });
  });
  await gotoConceptPage(page, concepts[0], 'index.html');
  await expect(page.locator('html')).not.toHaveClass(/(?:^|\s)js(?:\s|$)/);
  await expect(page.getByRole('link', { name: 'Services', exact: true }).first()).toBeVisible();
});

test('configured endpoint failures show an in-page error state', async ({ page }) => {
  await page.route('**/configured-endpoint', async (route) => {
    await route.fulfill({ status: 500, body: 'Nope' });
  });
  await gotoConceptPage(page, concepts[0], 'site-audit.html');
  await page.evaluate(() => { window.FORM_ENDPOINTS.audit = '/configured-endpoint'; });
  await completeAudit(page, concepts[0]);
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
  await gotoConceptPage(page, concepts[0], 'site-audit.html');
  await page.evaluate(() => { window.FORM_ENDPOINTS.audit = '/configured-endpoint'; });
  await completeAudit(page, concepts[0]);
  const submit = page.getByRole('button', { name: /request a site audit/i });
  await submit.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText(/thanks/i);
  expect(submissions).toBe(1);
});

for (const concept of concepts) {
  test(`${concept.name} settled desktop and mobile screenshots can be captured over local HTTP`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1200 });
    await gotoConceptPage(page, concept, 'index.html');
    await expect(page).toHaveURL(new RegExp(`${concept.path}/index\\.html$`));
    await settleForScreenshot(page);
    await page.screenshot({ path: path.join(repoRoot, `artifacts/screenshots/${concept.screenshotPrefix}-home-desktop.png`), fullPage: true });
    await page.setViewportSize({ width: 390, height: 900 });
    await gotoConceptPage(page, concept, 'index.html');
    await expect(page).toHaveURL(new RegExp(`${concept.path}/index\\.html$`));
    await settleForScreenshot(page);
    await page.screenshot({ path: path.join(repoRoot, `artifacts/screenshots/${concept.screenshotPrefix}-home-mobile.png`), fullPage: true });
  });
}

test('settleForScreenshot loads and decodes lazy images before capture', async ({ page }) => {
  await gotoConceptPage(page, concepts[0], 'index.html');
  await page.evaluate(() => {
    const image = document.createElement('img');
    image.id = 'lazy-screenshot-probe';
    image.loading = 'lazy';
    image.src = 'assets/img/hero-digital-operations.png';
    image.style.cssText = 'position:absolute; top:100000px;';
    document.body.append(image);
  });
  await settleForScreenshot(page);
  await expect.poll(() => page.locator('#lazy-screenshot-probe').evaluate((image) => image.naturalWidth > 0)).toBe(true);
});
