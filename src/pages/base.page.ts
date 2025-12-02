import { Page, Locator } from '@playwright/test';
import { logAction, logPageNavigation } from '../utils/logger';
import { TIMEOUTS } from '../config/constants';

/**
 * Base Page Object
 * Equivalent to Python's pages/base_page.py
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ═══════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════

  async navigateTo(url: string): Promise<void> {
    const startTime = Date.now();
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    logPageNavigation(url, Date.now() - startTime);
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

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT INTERACTIONS
  // ═══════════════════════════════════════════════════════════════════

  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected async click(selector: string): Promise<void> {
    logAction('click', selector);
    await this.getLocator(selector).click();
  }

  protected async fill(selector: string, text: string): Promise<void> {
    logAction('fill', selector, text);
    await this.getLocator(selector).fill(text);
  }

  protected async type(selector: string, text: string): Promise<void> {
    logAction('type', selector, text);
    await this.getLocator(selector).pressSequentially(text);
  }

  protected async clear(selector: string): Promise<void> {
    logAction('clear', selector);
    await this.getLocator(selector).clear();
  }

  protected async clearAndFill(selector: string, text: string): Promise<void> {
    await this.clear(selector);
    await this.fill(selector, text);
  }

  protected async pressKey(key: string): Promise<void> {
    logAction('pressKey', key);
    await this.page.keyboard.press(key);
  }

  protected async hover(selector: string): Promise<void> {
    logAction('hover', selector);
    await this.getLocator(selector).hover();
  }

  protected async doubleClick(selector: string): Promise<void> {
    logAction('doubleClick', selector);
    await this.getLocator(selector).dblclick();
  }

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT STATE
  // ═══════════════════════════════════════════════════════════════════

  protected async getText(selector: string): Promise<string> {
    return (await this.getLocator(selector).textContent()) || '';
  }

  protected async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.getLocator(selector).getAttribute(attribute);
  }

  protected async getValue(selector: string): Promise<string> {
    return this.getLocator(selector).inputValue();
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return this.getLocator(selector).isVisible();
  }

  protected async isEnabled(selector: string): Promise<boolean> {
    return this.getLocator(selector).isEnabled();
  }

  protected async isChecked(selector: string): Promise<boolean> {
    return this.getLocator(selector).isChecked();
  }

  protected async count(selector: string): Promise<number> {
    return this.getLocator(selector).count();
  }

  protected async getAllTextContents(selector: string): Promise<string[]> {
    return this.getLocator(selector).allTextContents();
  }

  // ═══════════════════════════════════════════════════════════════════
  // FORM CONTROLS
  // ═══════════════════════════════════════════════════════════════════

  protected async selectOption(selector: string, value: string): Promise<void> {
    logAction('selectOption', selector, value);
    await this.getLocator(selector).selectOption(value);
  }

  protected async check(selector: string): Promise<void> {
    logAction('check', selector);
    await this.getLocator(selector).check();
  }

  protected async uncheck(selector: string): Promise<void> {
    logAction('uncheck', selector);
    await this.getLocator(selector).uncheck();
  }

  // ═══════════════════════════════════════════════════════════════════
  // INDEXED ELEMENT OPERATIONS
  // ═══════════════════════════════════════════════════════════════════

  protected async clickNth(selector: string, index: number): Promise<void> {
    logAction('clickNth', selector, `index: ${index}`);
    await this.getLocator(selector).nth(index).click();
  }

  protected async getNthText(selector: string, index: number): Promise<string> {
    return (await this.getLocator(selector).nth(index).textContent()) || '';
  }

  // ═══════════════════════════════════════════════════════════════════
  // WAITS
  // ═══════════════════════════════════════════════════════════════════

  protected async waitForVisible(
    selector: string,
    timeout: number = TIMEOUTS.DEFAULT,
  ): Promise<Locator> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  protected async waitForHidden(
    selector: string,
    timeout: number = TIMEOUTS.DEFAULT,
  ): Promise<void> {
    await this.getLocator(selector).waitFor({ state: 'hidden', timeout });
  }

  protected async waitForUrl(
    urlOrRegex: string | RegExp,
    timeout = TIMEOUTS.NAVIGATION,
  ): Promise<void> {
    await this.page.waitForURL(urlOrRegex, { timeout });
  }

  protected async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
  ): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  // ═══════════════════════════════════════════════════════════════════
  // SCREENSHOTS
  // ═══════════════════════════════════════════════════════════════════

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  async takeElementScreenshot(selector: string, name: string): Promise<Buffer> {
    return this.getLocator(selector).screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}
