import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { BingLocators } from '../locators/search-engine.locators';
import { settings } from '../config/settings';
export class SearchEnginePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ═══════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════

  async open(): Promise<this> {
    await this.navigateTo(settings().baseUrl);
    return this;
  }

  async openUrl(url: string): Promise<this> {
    await this.navigateTo(url);
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SEARCH ACTIONS
  // ═══════════════════════════════════════════════════════════════════

  async isSearchInputVisible(): Promise<boolean> {
    return this.isVisible(BingLocators.SEARCH_INPUT);
  }

  async enterSearchQuery(query: string): Promise<this> {
    await this.fill(BingLocators.SEARCH_INPUT, query);
    return this;
  }

  /**
   * Consolidated search method
   * @param query - Search query string
   * @param options - Search options
   * @param options.waitForResults - Whether to wait for results to appear (default: true)
   * @param options.timeout - Timeout for waiting for results (default: 15000)
   */
  async search(
    query: string,
    options: { waitForResults?: boolean; timeout?: number } = {},
  ): Promise<this> {
    const { waitForResults = true, timeout = 15000 } = options;

    await this.enterSearchQuery(query);
    await this.pressKey('Enter');
    await this.waitForLoadState('domcontentloaded');

    if (waitForResults) {
      try {
        await this.waitForVisible(BingLocators.RESULT_ITEMS, timeout);
      } catch {
        // Results may be blocked by CAPTCHA - this is expected in automation
      }
    }

    return this;
  }

  // ═══════════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════════

  async hasResults(): Promise<boolean> {
    return (await this.getResultsCount()) > 0;
  }

  async getResultsCount(): Promise<number> {
    return this.count(BingLocators.RESULT_ITEMS);
  }

  async getResultTitles(): Promise<string[]> {
    return this.getAllTextContents(BingLocators.RESULT_TITLES);
  }

  async clickResult(index: number): Promise<void> {
    await this.waitForLoadState('networkidle');
    await this.clickNth(`${BingLocators.RESULT_TITLES} a`, index);
  }

  // ═══════════════════════════════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════════════════════════════

  async verifyResultsContain(text: string): Promise<boolean> {
    const titles = await this.getResultTitles();
    const allText = titles.join(' ').toLowerCase();
    return allText.includes(text.toLowerCase());
  }

  async waitForResults(): Promise<void> {
    await this.waitForVisible(BingLocators.RESULTS_CONTAINER);
  }
}
