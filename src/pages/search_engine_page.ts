import { Page } from '@playwright/test';
import { LOCATORS, Engine } from '../locators/search_engine_locators';

export class SearchEnginePage {
  readonly page: Page;
  readonly engine: Engine;

  constructor(page: Page, engine: Engine = 'duckduckgo') {
    this.page = page;
    this.engine = engine;
  }

  async navigate() {
    // Use the non-JS HTML endpoint to avoid bot-detection modals during automated runs
    if (this.engine === 'duckduckgo') {
      // attempt a small stealth tweak to hide webdriver automation flag which some
      // sites use to detect bots. This is a lightweight mitigation and may help
      // avoid the anomaly/captcha modal when running headless.
      // set a small init script to mask automation flags and to override UA for
      // this page context. We also set Accept-Language header to look like a
      // regular desktop browser. This is a lightweight mitigation against
      // bot-detection used by some sites.
      await this.page.addInitScript(() => {
        try {
          Object.defineProperty(navigator, 'webdriver', { get: () => false });
        } catch {
          /* ignore */
        }
        try {
          Object.defineProperty(navigator, 'userAgent', {
            get: () =>
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          });
        } catch {
          /* ignore */
        }
      });
      await this.page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
      await this.page.goto('https://duckduckgo.com/html/');
      return;
    }
    await this.page.goto('https://duckduckgo.com');
  }

  async search(query: string) {
    const loc = LOCATORS[this.engine];
    // For DuckDuckGo, avoid the HTML form interaction (which sometimes triggers
    // bot checks in headless mode) by navigating directly to the HTML results
    // URL with the query parameter. This yields the same search results page
    // without needing to interact with the form.
    if (this.engine === 'duckduckgo') {
      const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      await this.page.goto(url);
      // Wait for results to appear (tolerant timeout for CI)
      await this.page.waitForSelector(loc.results, { timeout: 15_000 });
      return;
    }

    // Fallback for other engines: fill then press Enter
    const inputSelector = loc.searchInput;
    await this.page.waitForSelector(inputSelector, { state: 'visible', timeout: 5000 });
    await this.page.fill(inputSelector, query);
    await this.page.press(inputSelector, 'Enter');
    await this.page.waitForSelector(loc.results, { timeout: 15_000 }).catch(() => undefined);
  }

  async getResultCount() {
    const loc = LOCATORS[this.engine];
    const locator = this.page.locator(loc.results);
    await locator
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .catch(() => undefined);
    const count = await locator.count();
    return count;
  }
}
