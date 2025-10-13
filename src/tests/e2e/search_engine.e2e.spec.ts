import { test, expect } from '@playwright/test';
import { SearchEnginePage } from '../../pages/search_engine_page';

test.describe('Search Engine E2E', () => {
  test('duckduckgo: basic search returns results', async ({ page }) => {
    const searchPage = new SearchEnginePage(page, 'duckduckgo');
    await searchPage.navigate();
    await searchPage.search('playwright typescript');
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });
});
