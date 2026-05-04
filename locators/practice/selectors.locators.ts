import type { Page } from '@playwright/test';

/**
 * SelectorsLocators — locators for /selectors.html (all 10 selector strategy sections).
 * Pure locator definitions — zero logic, zero assertions (Law 1 & Law 2).
 */
export class SelectorsLocators {
  constructor(private readonly page: Page) {}

  // ── 1 · id & name ──────────────────────────────────────────────────────
  get inputUsername() { return this.page.getByTestId('input-username'); }
  get inputPassword() { return this.page.getByTestId('input-password'); }

  // ── 2 · CSS class & attribute ───────────────────────────────────────────
  get btnPrimary()   { return this.page.getByTestId('btn-primary'); }
  get btnSecondary() { return this.page.getByTestId('btn-secondary'); }
  get badgeSuccess() { return this.page.getByTestId('badge-success'); }
  get badgeWarning() { return this.page.getByTestId('badge-warning'); }
  get badgeError()   { return this.page.getByTestId('badge-error'); }

  // ── 3 · link text ───────────────────────────────────────────────────────
  get linkExact()   { return this.page.getByTestId('link-exact'); }
  get linkPartial() { return this.page.getByTestId('link-partial'); }
  get linkAria()    { return this.page.getByTestId('link-aria'); }

  // ── 4 · ARIA ────────────────────────────────────────────────────────────
  get inputEmail()     { return this.page.getByTestId('input-email'); }
  get liveRegion()     { return this.page.getByTestId('live-region'); }
  get btnTriggerLive() { return this.page.getByTestId('btn-trigger-live'); }

  // ── 5 · form attributes ─────────────────────────────────────────────────
  get inputDisabled() { return this.page.getByTestId('input-disabled'); }
  get selectCountry() { return this.page.getByTestId('select-country'); }
  get checkboxAgree() { return this.page.getByTestId('checkbox-agree'); }
  get radioBasic()    { return this.page.getByTestId('radio-basic'); }
  get radioPro()      { return this.page.getByTestId('radio-pro'); }

  // ── 6 · data attributes ─────────────────────────────────────────────────
  get productList()        { return this.page.getByTestId('product-list'); }
  get productItems()       { return this.page.getByTestId('product-item'); }
  get productElectronics() { return this.page.locator('[data-category="electronics"]'); }

  // ── 7 · image ───────────────────────────────────────────────────────────
  get imgLogo() { return this.page.getByTestId('img-logo'); }

  // ── 8 · title attribute ─────────────────────────────────────────────────
  get btnSave()   { return this.page.getByTestId('btn-save'); }
  get btnDelete() { return this.page.getByTestId('btn-delete'); }
  get abbrQA()    { return this.page.getByTestId('abbr-qa'); }

  // ── 9 · table ───────────────────────────────────────────────────────────
  get dataTable() { return this.page.getByTestId('data-table'); }
  get tableRows() { return this.page.getByTestId('table-row'); }
  tableRowNameCell(rowId: number | string) {
    return this.page.locator(`[data-row-id="${rowId}"] [headers="col-name"]`);
  }

  // ── 10 · XPath targets ──────────────────────────────────────────────────
  get fruitList()    { return this.page.getByTestId('fruit-list'); }
  get fruitItems()   { return this.page.getByTestId('fruit-item'); }
  get xpathText()    { return this.page.getByTestId('xpath-text'); }
  get xpathPartial() { return this.page.getByTestId('xpath-partial'); }
}
