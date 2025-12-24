import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../config/constants';

/**
 * Base Page Object - Modernized for Playwright 2025
 *
 * Design principles:
 * - Thin wrapper: Only methods that add value over native Playwright
 * - No logging: Playwright's trace provides better debugging
 * - Direct Locator access: Use locator() for advanced chaining
 * - YAGNI: Only includes methods actually used by child pages
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════════════
  // LOCATOR ACCESS - Use for advanced Playwright features
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Get a Locator for advanced operations like .filter(), .first(), .getByRole()
   * Prefer this over wrapper methods when you need Playwright's full API
   */
  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  // Alias for backward compatibility
  protected getLocator(selector: string): Locator {
    return this.locator(selector);
  }

  // ═══════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT INTERACTIONS - Direct Playwright calls, no wrapper overhead
  // ═══════════════════════════════════════════════════════════════════

  protected async click(selector: string): Promise<void> {
    await this.locator(selector).click();
  }

  protected async fill(selector: string, text: string): Promise<void> {
    await this.locator(selector).fill(text);
  }

  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  protected async selectOption(selector: string, value: string): Promise<void> {
    await this.locator(selector).selectOption(value);
  }

  protected async clickNth(selector: string, index: number): Promise<void> {
    await this.locator(selector).nth(index).click();
  }

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT STATE - Simple getters, no transformation needed
  // ═══════════════════════════════════════════════════════════════════

  protected async getText(selector: string): Promise<string> {
    return (await this.locator(selector).textContent()) ?? '';
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return this.locator(selector).isVisible();
  }

  protected async count(selector: string): Promise<number> {
    return this.locator(selector).count();
  }

  protected async getAllTextContents(selector: string): Promise<string[]> {
    return this.locator(selector).allTextContents();
  }

  // ═══════════════════════════════════════════════════════════════════
  // WAITS - Only the commonly used ones
  // ═══════════════════════════════════════════════════════════════════

  protected async waitForVisible(
    selector: string,
    timeout: number = TIMEOUTS.DEFAULT,
  ): Promise<Locator> {
    const loc = this.locator(selector);
    await loc.waitFor({ state: 'visible', timeout });
    return loc;
  }

  protected async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}
