import { test, expect } from '@playwright/test';
import { SearchEnginePage } from '../../pages/search_engine_page';
import path from 'path';
import fs from 'fs';

test.describe('Search Engine E2E', () => {
  test('duckduckgo: basic search returns results', async ({ page }) => {
    // In CI (or when CI=true) intercept the request and serve a local fixture to
    // avoid flakiness caused by DuckDuckGo's bot-detection for headless runs.
    if (process.env.CI === 'true') {
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'duckduckgo_html_results.html');
      const html = fs.readFileSync(fixturePath, 'utf8');
      await page.route('**/html/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: html }),
      );
    }

    const searchPage = new SearchEnginePage(page, 'duckduckgo');
    await searchPage.navigate();
    await searchPage.search('playwright typescript');
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });
});
