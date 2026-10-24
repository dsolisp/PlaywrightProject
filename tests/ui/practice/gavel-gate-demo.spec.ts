import { test, expect } from '@playwright/test';

/**
 * DEMO ONLY — intentional Gavel constitution violation.
 * Purpose: prove `gavel-pr-check` blocks corrupt / flaky timing patterns on PRs.
 * Do not merge.
 */
test.describe('gavel gate demo (should fail CI)', () => {
  test('corrupt waitForTimeout that gavel must reject', async ({ page }) => {
    await page.goto('https://example.com');
    // manual-wait — Test Constitution: no arbitrary sleeps
    await page.waitForTimeout(3000);
    await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
  });
});
