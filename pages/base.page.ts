import type { Page } from '@playwright/test';

/**
 * BasePage — shared driver reference injected into every Page Object.
 * Inheritance capped at 1 level: MyPage extends BasePage (Law 4).
 * Contains zero assertions — pages return values; tests assert (Law 2).
 */
export abstract class BasePage {
  constructor(readonly page: Page) {}

  /** Navigate to a given URL path relative to the configured baseURL. */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait for network to be idle (useful after heavy navigations). */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /** Return the current page URL. */
  currentUrl(): string {
    return this.page.url();
  }
}
