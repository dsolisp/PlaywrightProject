import { test, expect } from '@playwright/test';
import { SearchEnginePage } from '../../pages/search_engine_page';
import { EnhancedTestUtils } from '../../utils/errorRecovery';
import path from 'path';
import fs from 'fs';
import { allure } from 'allure-playwright';

test.describe('Search Engine E2E', () => {
  let testUtils: EnhancedTestUtils;

  test.beforeEach(async ({ page }) => {
    testUtils = new EnhancedTestUtils();

    // Add environment info to Allure
    allure.parameter('Browser', page.context().browser()?.browserType().name() || 'unknown');
    allure.parameter('Environment', process.env.NODE_ENV || 'development');
    allure.parameter('CI', process.env.CI || 'false');
  });

  test('duckduckgo: basic search returns results', async ({ page }) => {
    await allure.epic('Search Engine Automation');
    await allure.feature('Basic Search');
    await allure.story('DuckDuckGo Search Results');

    // Helper to wire the local HTML fixture for stable runs (used in CI and
    // as a local fallback if the live site blocks headless requests).
    const useFixture = async () => {
      const fixturePath = path.join(__dirname, '..', 'fixtures', 'duckduckgo_html_results.html');
      const html = fs.readFileSync(fixturePath, 'utf8');
      await page.route('**/html/**', (route) =>
        route.fulfill({ status: 200, contentType: 'text/html', body: html }),
      );
    };

    const searchPage = new SearchEnginePage(page, 'duckduckgo');

    // Run test with system monitoring
    await testUtils.runTestWithMonitoring(async () => {
      await allure.step('Navigate to search engine', async () => {
        await testUtils.runWithRetryAndRecovery(
          page,
          async () => await searchPage.navigate(),
          2,
          async () => {
            // Recovery: refresh page
            await page.reload();
          },
        );
      });

      // Try a live search first; if it fails locally (likely due to bot
      // detection), retry using the local fixture so developers can run tests
      // reliably without modifying environment variables.
      try {
        await allure.step('Perform search for "playwright typescript"', async () => {
          await testUtils.runWithRetryAndRecovery(
            page,
            async () => await searchPage.search('playwright typescript'),
            2,
            async () => {
              // Recovery: clear search and retry
              await page.reload();
            },
          );
        });
      } catch (err) {
        if (process.env.CI === 'true') throw err; // bubble up in CI
        // Local failure: wire fixture and retry once

        console.warn('Live search failed; retrying with local fixture for stability.');
        await allure.step('Retry with local fixture', async () => {
          await useFixture();
          // Re-navigate so the fixture route can intercept the HTML request
          await testUtils.runWithRetryAndRecovery(
            page,
            async () => {
              await searchPage.navigate();
              await searchPage.search('playwright typescript');
            },
            1,
          );
        });
      }

      await allure.step('Verify search results', async () => {
        const count = await searchPage.getResultCount();
        expect(count).toBeGreaterThan(0);
        allure.attachment('Result Count', count.toString(), 'text/plain');
      });

      // Add screenshot attachment
      const screenshot = await page.screenshot();
      allure.attachment('Final Screenshot', screenshot, 'image/png');
    });
  });
});
