import type { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { WindowsLocators } from '../../locators/practice/windows.locators';
import { URLS } from '../../config/constants';

/**
 * WindowsPage — Gold Standard POM for /windows.html (ADV-E5, ADV-E6).
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * All selectors live in WindowsLocators (Law 1).
 *
 * Playwright can switch to new browser context pages (real tab switching).
 *   E5 — use context.waitForEvent('page') to capture the new tab then assert.
 *   E6 — same strategy; window.open() triggers a new context page.
 */
export class WindowsPage extends BasePage {
  private readonly locators: WindowsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new WindowsLocators(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async open(): Promise<this> {
    await this.page.goto(`${URLS.PRACTICE_APP}/windows.html`);
    return this;
  }

  // ── ADV-E5: target="_blank" link ──────────────────────────────────────
  tabLink() {
    return this.locators.openTabLink;
  }
  tabButton() {
    return this.locators.openTabJs;
  }

  // ── /windows/new.html getters ──────────────────────────────────────────
  newWindowHeading() {
    return this.locators.newWindowHeading;
  }
  newWindowBody() {
    return this.locators.newWindowBody;
  }
}
