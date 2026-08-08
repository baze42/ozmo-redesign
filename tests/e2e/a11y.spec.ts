import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage has no detectable axe violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('homepage supports reduced motion without hiding the transformation states', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByTestId('mockup-before')).toBeVisible();
  await expect(page.getByTestId('mockup-after')).toBeVisible();
  await expect(page.locator('.transformation-stage')).toHaveCSS('animation-name', 'none');
});

test('keyboard users can reach skip link and primary navigation actions', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'OZMO Digital home' })).toBeFocused();

  const primaryCta = page.getByRole('link', { name: 'Get a Free Site Review' }).first();
  await primaryCta.focus();
  await expect(primaryCta).toBeFocused();
});
