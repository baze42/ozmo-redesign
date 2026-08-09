import { expect, test } from '@playwright/test';

test('homepage renders the full WordPress-backed marketing flow', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Turn a slow or unclear website into a fast, polished lead path',
  );
  await expect(page.getByRole('heading', { name: 'When the site works against the business' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A practical partner for the path forward' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review, improve or build, launch, optimize' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Services built around clearer lead paths' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Transformation examples' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'From unclear to ready for leads' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Useful notes before you rebuild' })).toBeVisible();

  await expect(page.getByRole('link', { name: 'Get a Free Site Review' }).first()).toHaveAttribute(
    'href',
    '/free-site-audit',
  );
});

test('services page renders six WordPress service entries and outcomes', async ({ page }) => {
  await page.goto('/services');

  await expect(page).toHaveTitle(/Services/);
  await expect(page.getByRole('heading', { level: 1, name: 'Services for faster, clearer lead paths' })).toBeVisible();
  await expect(page.locator('[data-testid="service-card"]')).toHaveCount(6);
  await expect(page.getByText('Website design and builds')).toBeVisible();
  await expect(page.getByText('Ongoing website care and optimization')).toBeVisible();
  await expect(page.getByText('Business outcomes')).toHaveCount(6);
});

test('portfolio page renders qualitative transformations without fake proof', async ({ page }) => {
  await page.goto('/portfolio');

  await expect(page).toHaveTitle(/Transformation examples/);
  await expect(page.getByRole('heading', { level: 1, name: 'Transformation examples' })).toBeVisible();
  await expect(page.locator('[data-testid="transformation-card"]')).toHaveCount(3);
  await expect(page.getByText('Service business homepage with no clear next step')).toBeVisible();

  const impactText = await page.locator('[data-testid="transformation-impact"]').allTextContents();
  expect(impactText.join(' ')).not.toMatch(/%|\$|#\d|PageSpeed|\d+\s+leads/i);
});

test('blog index and detail render WordPress posts with natural site review CTAs', async ({ page }) => {
  await page.goto('/blog');

  await expect(page).toHaveTitle(/Blog/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('[data-testid="blog-card"]')).toHaveCount(3);

  await page.getByRole('link', { name: /Why website speed affects leads/ }).click();
  await expect(page).toHaveURL('/blog/why-website-speed-affects-leads');
  await expect(page.getByRole('heading', { level: 1, name: 'Why website speed affects leads' })).toBeVisible();
  const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(jsonLd).toContain('BlogPosting');
  await expect(page.getByRole('link', { name: 'Get a Free Site Review' }).last()).toHaveAttribute(
    'href',
    '/free-site-audit',
  );
});

test('robots and rss routes expose only public crawlable content', async ({ page }) => {
  const robots = await page.request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  expect(robotsText).toContain('Disallow: /admin/');
  expect(robotsText).toContain('Disallow: /schedule/review/');
  expect(robotsText).toContain('Disallow: /schedule/manage/');
  expect(robotsText).toContain('Sitemap: https://ozmodigital.com/sitemap-index.xml');

  const rss = await page.request.get('/rss.xml');
  expect(rss.ok()).toBe(true);
  const rssText = await rss.text();
  expect(rssText).toContain('<rss version="2.0">');
  expect(rssText).toContain('<item>');
  expect(rssText).toContain('/blog/why-website-speed-affects-leads');
});
