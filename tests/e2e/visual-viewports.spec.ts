import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 760 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 960 },
];

for (const viewport of viewports) {
  test(`homepage hero fits without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Turn a slow or unclear website into a fast, polished lead path',
    );
    await expect(page.getByText('Before', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('After', { exact: true }).first()).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}

test('mobile hero stacks after state above before state below 400px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('/');

  const afterBox = await page.getByTestId('mockup-after').boundingBox();
  const beforeBox = await page.getByTestId('mockup-before').boundingBox();

  expect(afterBox).not.toBeNull();
  expect(beforeBox).not.toBeNull();
  expect(afterBox!.y).toBeLessThan(beforeBox!.y);
});

test('desktop hero presents before and after states side by side', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');

  const afterBox = await page.getByTestId('mockup-after').boundingBox();
  const beforeBox = await page.getByTestId('mockup-before').boundingBox();

  expect(afterBox).not.toBeNull();
  expect(beforeBox).not.toBeNull();
  expect(beforeBox!.x).toBeLessThan(afterBox!.x);
  expect(Math.abs(beforeBox!.y - afterBox!.y)).toBeLessThan(80);
});
