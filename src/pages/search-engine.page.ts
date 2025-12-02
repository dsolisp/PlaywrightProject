import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { BingLocators } from '../locators/search-engine.locators';
import { settings } from '../config/settings';

/**
 * Bing Search Engine Page Object
 * Equivalent to Python's pages/search_engine_page.py
 */
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
   * Submit search by pressing Enter key
   * Waits for suggestions to appear, then submits
   * Does not wait for results - caller should handle waiting
   */
  async submitWithEnter(): Promise<this> {
    // Wait a moment for suggestions to load
    await this.page.waitForTimeout(500);
    // Press Enter to submit the search
    await this.page.keyboard.press('Enter');
    // Wait for navigation to start
    await this.page.waitForURL(/search/, { timeout: 10000 }).catch(() => {
      // URL might not change if blocked
    });
    return this;
  }

  async submitSearch(): Promise<this> {
    // Press Enter to submit
    await this.pressKey('Enter');
    // Wait for page to load and results to appear
    await this.waitForLoadState('domcontentloaded');
    // Wait for result items to appear (may timeout if blocked)
    try {
      await this.page.waitForSelector(BingLocators.RESULT_ITEMS, {
        state: 'attached',
        timeout: 15000,
      });
    } catch {
      // Results may be blocked by CAPTCHA - this is expected
    }
    return this;
  }

  async search(query: string): Promise<this> {
    await this.enterSearchQuery(query);
    await this.submitSearch();
    return this;
  }

  async searchWithEnter(query: string): Promise<this> {
    await this.enterSearchQuery(query);
    await this.pressKey('Enter');
    // Wait for page to load and results to appear
    await this.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForSelector(BingLocators.RESULT_ITEMS, {
        state: 'attached',
        timeout: 15000,
      });
    } catch {
      // Results may be blocked by CAPTCHA - this is expected
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
    const locator = this.getLocator(BingLocators.RESULT_TITLES);
    return locator.allTextContents();
  }

  async clickResult(index: number): Promise<void> {
    // Wait for results to be stable
    await this.page.waitForLoadState('networkidle');
    // Click on the link inside h2
    const results = this.getLocator(`${BingLocators.RESULT_TITLES} a`);
    await results.nth(index).click({ timeout: 15000 });
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
    // Wait for results container like Python does
    await this.waitForVisible(BingLocators.RESULTS_CONTAINER);
  }
}
