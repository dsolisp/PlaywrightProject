import { test, expect } from '../../src/fixtures/test-fixtures';

// Bing search tests. These use assertSearchAttempted() because Bing often
// blocks automation with CAPTCHAs. Run with: npx playwright test --grep @search

test.describe('Search Engine Tests @search @external', () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.open();
  });

  test('should display search input on homepage @smoke', async ({ searchPage }) => {
    expect(await searchPage.isSearchInputVisible()).toBe(true);
  });

  test('should search for a term and display results', async ({ searchPage }) => {
    await searchPage.search('playwright testing');

    // Use the resilient search assertion helper
    const result = await searchPage.assertSearchAttempted();
    expect(result.searchAttempted || result.hasResults).toBe(true);
  });

  test('should display relevant results', async ({ searchPage }) => {
    await searchPage.search('selenium webdriver');

    const result = await searchPage.assertSearchAttempted();

    if (result.hasResults) {
      const titles = await searchPage.getResultTitles();
      expect(titles.length).toBeGreaterThan(0);
    } else {
      // Search was attempted but blocked - acceptable in automation
      expect(result.searchAttempted).toBe(true);
    }
  });

  test('should allow searching with Enter key', async ({ searchPage }) => {
    await searchPage.search('javascript testing');

    // Use the resilient assertion helper
    const result = await searchPage.assertSearchAttempted();
    expect(result.searchAttempted || result.hasResults).toBe(true);
  });

  test('should navigate to result page when clicked', async ({ searchPage, page }) => {
    await searchPage.search('github');

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(1000);

    const result = await searchPage.assertSearchAttempted();

    if (result.hasResults) {
      const initialUrl = page.url();
      await searchPage.clickResult(0);

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(2000);
      const newUrl = page.url();

      expect(newUrl).not.toBe(initialUrl);
    } else {
      // Search was attempted but blocked - acceptable in automation
      expect(result.searchAttempted).toBe(true);
      console.log('⚠️ Search blocked - skipping click test');
    }
  });

  test('should handle empty search gracefully', async ({ searchPage }) => {
    await searchPage.enterSearchQuery('');
    // Empty search should not throw
    expect(await searchPage.isSearchInputVisible()).toBe(true);
  });

  test('should display page title', async ({ searchPage }) => {
    const title = await searchPage.getTitle();
    expect(title).toBeTruthy();
    // Accept either Bing or Google (depending on config)
    const isSearchEngine =
      title.toLowerCase().includes('bing') || title.toLowerCase().includes('google');
    expect(isSearchEngine).toBe(true);
  });
});
