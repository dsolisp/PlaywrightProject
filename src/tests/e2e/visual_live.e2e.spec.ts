import { test, expect } from '@playwright/test';

// Skip this test by default. To run live visual checks against DuckDuckGo set
// USE_LIVE=true in your environment. Running live tests in CI is not
// recommended because headless runs are often fingerprinted and blocked.
test.skip(process.env.USE_LIVE !== 'true', 'Set USE_LIVE=true to run live visual tests');

test('live DuckDuckGo search matches baseline', async ({ page }) => {
  // Use the HTML endpoint for more deterministic results
  const query = 'playwright typescript';
  await page.goto(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`);

  // Wait for results to appear
  await page.waitForSelector('.result, a.result__a, #links .result, .results_links_deep', {
    timeout: 20_000,
  });

  // Take a full-page screenshot and compare with the Playwright-managed baseline.
  // Use `--update-snapshots` to regenerate the baseline when intended.
  await expect(page).toHaveScreenshot('duckduckgo-live.png');
});
