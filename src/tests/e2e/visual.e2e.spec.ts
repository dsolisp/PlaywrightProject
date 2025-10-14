import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Visual E2E - DuckDuckGo fixture', () => {
  test('fixture matches baseline (Playwright snapshot)', async ({ page }) => {
    const fixturePath = path.join(__dirname, '..', 'fixtures', 'duckduckgo_html_results.html');
    const html = fs.readFileSync(fixturePath, 'utf8');

    await page.setViewportSize({ width: 1200, height: 800 });
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Playwright's snapshot matcher uses pixelmatch internally and will
    // produce a diff image when the snapshot does not match the baseline.
    // The baseline filename will be stored in the Playwright snapshots folder
    // (managed by Playwright Test). When you intentionally update the baseline
    // run the test with `--update-snapshots`.
    await expect(page).toHaveScreenshot('duckduckgo-playwright.png');
  });
});
