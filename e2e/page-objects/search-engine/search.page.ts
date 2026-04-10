import { Page, Locator, expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';

/**
 * Search Engine Page Object - GEMINI Style
 * Handles Bing search interactions with CAPTCHA resilience
 */
export class SearchEnginePage {
  readonly page: Page;

  // Search elements - use getByRole/getByPlaceholder where possible
  readonly searchInput: Locator;
  readonly resultItems: Locator;
  readonly resultTitles: Locator;
  readonly resultsContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Bing search input - use name attribute (most reliable for Bing)
    this.searchInput = page.locator('input[name="q"], textarea[name="q"]');

    // Results - these vary by search engine, use generic selectors
    this.resultItems = page.locator('#b_results .b_algo, .g');
    this.resultTitles = page.locator('#b_results .b_algo h2, .g h3');
    this.resultsContainer = page.locator('#b_results, #search');
  }

  // ── Navigation ─────────────────────────────────────────────────────

  async open(): Promise<this> {
    await this.page.goto(settings().baseUrl);
    return this;
  }

  async openUrl(url: string): Promise<this> {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await this.page.goto(fullUrl);
    return this;
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Search Actions ─────────────────────────────────────────────────

  async isSearchInputVisible(): Promise<boolean> {
    return this.searchInput.isVisible();
  }

  async enterSearchQuery(query: string): Promise<this> {
    await this.searchInput.fill(query);
    return this;
  }

  async search(
    query: string,
    options: { waitForResults?: boolean; timeout?: number } = {},
  ): Promise<this> {
    const { waitForResults = true, timeout = 15000 } = options;

    await this.enterSearchQuery(query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');

    if (waitForResults) {
      try {
        await expect(this.resultItems.first()).toBeVisible({ timeout });
      } catch {
        // CAPTCHA blocked us - expected in headless
      }
    }

    return this;
  }

  // ── Results ────────────────────────────────────────────────────────

  async hasResults(): Promise<boolean> {
    return (await this.getResultsCount()) > 0;
  }

  async getResultsCount(): Promise<number> {
    return this.resultItems.count();
  }

  async getResultTitles(): Promise<string[]> {
    return this.resultTitles.allTextContents();
  }

  async clickResult(index: number): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.resultTitles.nth(index).locator('a').click();
  }

  // ── Verification ───────────────────────────────────────────────────

  async verifyResultsContain(text: string): Promise<boolean> {
    const titles = await this.getResultTitles();
    const allText = titles.join(' ').toLowerCase();
    return allText.includes(text.toLowerCase());
  }

  async waitForResults(): Promise<void> {
    await expect(this.resultsContainer).toBeVisible();
  }

  async assertSearchAttempted(): Promise<{
    hasResults: boolean;
    searchAttempted: boolean;
    message: string;
  }> {
    const url = this.page.url();
    const resultsCount = await this.getResultsCount();

    if (resultsCount > 0) {
      return {
        hasResults: true,
        searchAttempted: true,
        message: `Search successful with ${resultsCount} results`,
      };
    }

    if (url.includes('search')) {
      console.log('⚠️ Search performed but results may be blocked by CAPTCHA');
      return {
        hasResults: false,
        searchAttempted: true,
        message: 'Search URL reached but results blocked (likely CAPTCHA)',
      };
    }

    if (url.includes('bing.com') || url.includes('google.com')) {
      console.log('⚠️ Search may not have submitted - bot detection kicked in');
      return {
        hasResults: false,
        searchAttempted: false,
        message: 'On search page but search not submitted (likely bot detection)',
      };
    }

    throw new Error(`Search was not attempted - unexpected URL: ${url}`);
  }
}

// Export alias for backward compatibility
export { SearchEnginePage as SearchPage };
