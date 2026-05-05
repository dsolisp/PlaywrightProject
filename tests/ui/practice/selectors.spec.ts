import { test, expect } from '../../../fixtures/test.fixture';

/**
 * Selector Playground — all 10 selector strategies demonstrated.
 * Each test exercises one approach from the /selectors.html showcase.
 *
 * Law 3: all locators accessed via POM methods — no raw page.locator() in specs.
 */
test.describe('Practice App — Selector Playground @practice @selectors', () => {
  test.beforeEach(async ({ selectorsPage }) => {
    await selectorsPage.open();
  });

  test('S1 · id & name: should locate inputs by data-test (mirrors id/name)', async ({
    selectorsPage,
  }) => {
    await expect(selectorsPage.usernameInput()).toBeVisible();
    await expect(selectorsPage.usernameInput()).toHaveAttribute('id', 'username-field');
    await expect(selectorsPage.passwordInput()).toBeVisible();
    await expect(selectorsPage.passwordInput()).toHaveAttribute('name', 'password');
  });

  test('S2 · CSS class: should locate primary and secondary buttons', async ({ selectorsPage }) => {
    await expect(selectorsPage.primaryButton()).toHaveClass(/btn-primary/);
    await expect(selectorsPage.secondaryButton()).toHaveClass(/btn-secondary/);
  });

  test('S2 · CSS class: should locate status badges by variant', async ({ selectorsPage }) => {
    await expect(selectorsPage.successBadge()).toHaveText('Active');
    await expect(selectorsPage.warningBadge()).toHaveText('Pending');
    await expect(selectorsPage.errorBadge()).toHaveText('Inactive');
  });

  test('S3 · link text: should locate links by exact and partial text', async ({
    selectorsPage,
  }) => {
    await expect(selectorsPage.exactLink()).toContainText('Download Report');
    await expect(selectorsPage.partialLink()).toContainText('Annual Summary');
  });

  test('S3 · link text: should locate link by aria-label', async ({ selectorsPage }) => {
    await expect(selectorsPage.ariaLink()).toHaveAttribute(
      'aria-label',
      'Download the PDF document',
    );
  });

  test('S4 · ARIA: should locate input by role and aria-label', async ({ selectorsPage }) => {
    await expect(selectorsPage.emailInput()).toHaveAttribute('role', 'textbox');
    await expect(selectorsPage.emailInput()).toHaveAttribute('aria-label', 'Work email address');
  });

  test('S4 · ARIA: live region should update on trigger', async ({ selectorsPage }) => {
    await expect(selectorsPage.liveRegion()).toBeVisible();
    await selectorsPage.triggerLiveRegion();
    await expect(selectorsPage.liveRegion()).toContainText('Updated at');
  });

  test('S5 · form attrs: disabled input should not be editable', async ({ selectorsPage }) => {
    await expect(selectorsPage.disabledInput()).toBeDisabled();
  });

  test('S5 · form attrs: radio Pro should be pre-checked', async ({ selectorsPage }) => {
    await expect(selectorsPage.radioPro()).toBeChecked();
    await expect(selectorsPage.radioBasic()).not.toBeChecked();
  });

  test('S5 · form attrs: should select a country from the dropdown', async ({ selectorsPage }) => {
    await selectorsPage.selectCountry('us');
    await expect(selectorsPage.disabledInput()).toBeDisabled(); // guard: page still stable
  });

  test('S6 · data attributes: should locate products by data-test + data-category', async ({
    selectorsPage,
  }) => {
    await expect(selectorsPage.productItems()).toHaveCount(3);
    await expect(selectorsPage.electronicsItems()).toHaveCount(2);
  });

  test('S7 · image alt/title: should locate logo by alt and title', async ({ selectorsPage }) => {
    await expect(selectorsPage.logo()).toHaveAttribute('alt', 'QA Practice Lab logo');
    await expect(selectorsPage.logo()).toHaveAttribute('title', 'QA Practice Lab');
  });

  test('S8 · title attribute: should locate buttons by title', async ({ selectorsPage }) => {
    await expect(selectorsPage.saveButton()).toHaveAttribute('title', 'Save your current progress');
    await expect(selectorsPage.deleteButton()).toHaveAttribute(
      'title',
      'Delete this record permanently',
    );
  });

  test('S8 · title attribute: should locate abbr elements by title', async ({ selectorsPage }) => {
    await expect(selectorsPage.abbrQA()).toHaveAttribute('title', 'Quality Assurance');
  });

  test('S9 · table: should have 3 data rows', async ({ selectorsPage }) => {
    await expect(selectorsPage.tableRows()).toHaveCount(3);
    await expect(selectorsPage.tableRowNameCell(2)).toHaveText('Bob');
  });

  test('S10 · XPath targets: should locate fruit items via data-test', async ({
    selectorsPage,
  }) => {
    await expect(selectorsPage.fruitItems()).toHaveCount(3);
    await expect(selectorsPage.fruitItems().nth(1)).toHaveText('Banana');
  });

  test('S10 · XPath targets: should locate elements by text content', async ({ selectorsPage }) => {
    await expect(selectorsPage.xpathText()).toContainText('quick brown fox');
    await expect(selectorsPage.xpathPartial()).toContainText('partial text');
  });
});
