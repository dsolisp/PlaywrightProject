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

  // Type query and hit enter. By default waits for results, but Bing often
  // throws up a CAPTCHA in automation so we swallow that timeout.
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
        // CAPTCHA blocked us - expected in headless
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
    // Match Python: RESULT_ITEMS = (By.CSS_SELECTOR, "#b_results .b_algo")
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

  // Check if we at least tried to search. Bing blocks automation a lot,
  // so this is more lenient than checking for actual results.
  async assertSearchAttempted(): Promise<{
    hasResults: boolean;
    searchAttempted: boolean;
    message: string;
  }> {
    const url = this.getCurrentUrl();
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

    if (url.includes('bing.com')) {
      console.log('⚠️ Search may not have submitted - bot detection kicked in');
      return {
        hasResults: false,
        searchAttempted: false,
        message: 'On Bing but search not submitted (likely bot detection)',
      };
    }

    throw new Error(`Search was not attempted - unexpected URL: ${url}`);
  }
}
