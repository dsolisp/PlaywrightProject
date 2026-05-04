import type { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { SelectorsLocators } from '../../locators/practice/selectors.locators';
import { URLS } from '../../config/constants';

/**
 * SelectorsPage — Gold Standard POM for /selectors.html.
 * Demonstrates all 10 selector strategy sections.
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * All selectors live in SelectorsLocators (Law 1).
 */
export class SelectorsPage extends BasePage {
  private readonly locators: SelectorsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SelectorsLocators(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async open(): Promise<this> {
    await this.page.goto(`${URLS.PRACTICE_APP}/selectors.html`);
    return this;
  }

  // ── Section 1: id & name ──────────────────────────────────────────────
  usernameInput() {
    return this.locators.inputUsername;
  }
  passwordInput() {
    return this.locators.inputPassword;
  }

  // ── Section 2: CSS class & attribute ─────────────────────────────────
  primaryButton() {
    return this.locators.btnPrimary;
  }
  secondaryButton() {
    return this.locators.btnSecondary;
  }
  successBadge() {
    return this.locators.badgeSuccess;
  }
  warningBadge() {
    return this.locators.badgeWarning;
  }
  errorBadge() {
    return this.locators.badgeError;
  }

  // ── Section 3: link text ──────────────────────────────────────────────
  exactLink() {
    return this.locators.linkExact;
  }
  partialLink() {
    return this.locators.linkPartial;
  }
  ariaLink() {
    return this.locators.linkAria;
  }

  // ── Section 4: ARIA ───────────────────────────────────────────────────
  emailInput() {
    return this.locators.inputEmail;
  }
  liveRegion() {
    return this.locators.liveRegion;
  }
  async triggerLiveRegion(): Promise<void> {
    await this.locators.btnTriggerLive.click();
  }

  // ── Section 5: form attributes ────────────────────────────────────────
  disabledInput() {
    return this.locators.inputDisabled;
  }
  checkboxAgree() {
    return this.locators.checkboxAgree;
  }
  radioBasic() {
    return this.locators.radioBasic;
  }
  radioPro() {
    return this.locators.radioPro;
  }
  async selectCountry(value: string): Promise<void> {
    await this.locators.selectCountry.selectOption(value);
  }

  // ── Section 6: data attributes ────────────────────────────────────────
  productList() {
    return this.locators.productList;
  }
  productItems() {
    return this.locators.productItems;
  }
  electronicsItems() {
    return this.locators.productElectronics;
  }

  // ── Section 7: image ──────────────────────────────────────────────────
  logo() {
    return this.locators.imgLogo;
  }

  // ── Section 8: title attribute ────────────────────────────────────────
  saveButton() {
    return this.locators.btnSave;
  }
  deleteButton() {
    return this.locators.btnDelete;
  }
  abbrQA() {
    return this.locators.abbrQA;
  }

  // ── Section 9: table ──────────────────────────────────────────────────
  dataTable() {
    return this.locators.dataTable;
  }
  tableRows() {
    return this.locators.tableRows;
  }
  tableRowNameCell(rowId: number | string) {
    return this.locators.tableRowNameCell(rowId);
  }

  // ── Section 10: XPath targets ─────────────────────────────────────────
  fruitList() {
    return this.locators.fruitList;
  }
  fruitItems() {
    return this.locators.fruitItems;
  }
  xpathText() {
    return this.locators.xpathText;
  }
  xpathPartial() {
    return this.locators.xpathPartial;
  }
}
