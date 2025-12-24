import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../config/constants';

/**
 * BasePage provides common page-level operations and element interaction helpers.
 *
 * Design Decision: This class provides thin wrapper methods around Playwright's Locator API.
 * While Playwright's API is already clean, these wrappers:
 * - Ensure consistent selector-to-locator conversion across all page objects
 * - Provide a single place to add logging, error handling, or retry logic if needed
 * - Keep page object methods focused on business logic rather than selector handling
 *
 * For simple interactions, prefer using `this.locator(selector).action()` directly.
 * Use the helper methods when you need consistent behavior across the framework.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Locator Access ─────────────────────────────────────────────────

  /**
   * Get a Locator for the given selector.
   * Use this when you need to chain multiple Locator methods.
   */
  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  // ── Navigation ─────────────────────────────────────────────────────

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ── Element Interactions ───────────────────────────────────────────

  protected async click(selector: string): Promise<void> {
    await this.locator(selector).click();
  }

  protected async doubleClick(selector: string): Promise<void> {
    await this.locator(selector).dblclick();
  }

  protected async hover(selector: string): Promise<void> {
    await this.locator(selector).hover();
  }

  protected async fill(selector: string, text: string): Promise<void> {
    await this.locator(selector).fill(text);
  }

  protected async type(selector: string, text: string): Promise<void> {
    await this.locator(selector).pressSequentially(text);
  }

  protected async clear(selector: string): Promise<void> {
    await this.locator(selector).clear();
  }

  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  protected async selectOption(selector: string, value: string): Promise<void> {
    await this.locator(selector).selectOption(value);
  }

  protected async check(selector: string): Promise<void> {
    await this.locator(selector).check();
  }

  protected async uncheck(selector: string): Promise<void> {
    await this.locator(selector).uncheck();
  }

  protected async clickNth(selector: string, index: number): Promise<void> {
    await this.locator(selector).nth(index).click();
  }

  // ── Element State ──────────────────────────────────────────────────

  protected async getText(selector: string): Promise<string> {
    return (await this.locator(selector).textContent()) ?? '';
  }

  protected async getNthText(selector: string, index: number): Promise<string> {
    return (await this.locator(selector).nth(index).textContent()) ?? '';
  }

  protected async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.locator(selector).getAttribute(attribute);
  }

  protected async getValue(selector: string): Promise<string> {
    return this.locator(selector).inputValue();
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return this.locator(selector).isVisible();
  }

  protected async isEnabled(selector: string): Promise<boolean> {
    return this.locator(selector).isEnabled();
  }

  protected async isChecked(selector: string): Promise<boolean> {
    return this.locator(selector).isChecked();
  }

  protected async count(selector: string): Promise<number> {
    return this.locator(selector).count();
  }

  protected async getAllTextContents(selector: string): Promise<string[]> {
    return this.locator(selector).allTextContents();
  }

  // ── Waits ──────────────────────────────────────────────────────────

  protected async waitForVisible(
    selector: string,
    timeout: number = TIMEOUTS.DEFAULT,
  ): Promise<Locator> {
    const loc = this.locator(selector);
    await loc.waitFor({ state: 'visible', timeout });
    return loc;
  }

  protected async waitForHidden(selector: string, timeout = TIMEOUTS.DEFAULT): Promise<void> {
    await this.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  protected async waitForUrl(
    urlOrRegex: string | RegExp,
    timeout = TIMEOUTS.NAVIGATION,
  ): Promise<void> {
    await this.page.waitForURL(urlOrRegex, { timeout });
  }

  protected async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  // ── Screenshots ────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<Buffer> {
    return this.locator(selector).screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
