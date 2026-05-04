import type { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { DropdownLocators } from '../../locators/practice/dropdown.locators';
import { URLS } from '../../config/constants';

/**
 * DropdownPage — Gold Standard POM for /dropdown.html (ADV-E1, ADV-E2).
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * All selectors live in DropdownLocators (Law 1).
 */
export class DropdownPage extends BasePage {
  private readonly locators: DropdownLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new DropdownLocators(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async open(): Promise<this> {
    await this.page.goto(`${URLS.PRACTICE_APP}/dropdown.html`);
    return this;
  }

  // ── Actions ───────────────────────────────────────────────────────────

  /** ADV-E1: Select a value from the static dropdown. */
  async selectStatic(value: string): Promise<void> {
    await this.locators.staticDropdown.selectOption(value);
  }

  /** ADV-E2: Select a value from the dynamic dropdown. */
  async selectDynamic(value: string): Promise<void> {
    await this.locators.dynamicDropdown.selectOption(value);
  }

  // ── Getters ───────────────────────────────────────────────────────────
  staticDropdown() {
    return this.locators.staticDropdown;
  }
  staticStatus() {
    return this.locators.staticStatus;
  }
  dynamicDropdown() {
    return this.locators.dynamicDropdown;
  }
  dynamicStatus() {
    return this.locators.dynamicStatus;
  }
}
