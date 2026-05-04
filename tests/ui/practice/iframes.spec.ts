import { test, expect } from '../../../fixtures/test.fixture';

/**
 * ADV-E3 — Simple iframe with contenteditable editor
 * ADV-E4 — Nested iframes (outer → inner form)
 *
 * Law 3: all locators accessed via POM methods — no raw page.locator() in specs.
 * Playwright treats same-origin iframes as first-class DOM via frameLocator().
 */
test.describe('Practice App — Iframes @practice', () => {
  test.beforeEach(async ({ iframesPage }) => {
    await iframesPage.open();
  });

  // ── ADV-E3: Simple iframe (contenteditable editor) ──────────────────
  test.describe('ADV-E3: Simple iframe — contenteditable editor', () => {
    test('should display the editor iframe on the page', async ({ iframesPage }) => {
      await expect(iframesPage.parentFrame()).toBeVisible();
    });

    test('should allow typing in the contenteditable editor inside the iframe', async ({
      iframesPage,
    }) => {
      await iframesPage.typeInEditor('Hello from Playwright!');
      await expect(iframesPage.editor()).toContainText('Hello from Playwright!');
    });

    test('should clear the editor and accept new text', async ({ iframesPage }) => {
      await iframesPage.typeInEditor('First text');
      await iframesPage.editor().clear();
      await iframesPage.typeInEditor('Replaced text');
      await expect(iframesPage.editor()).toContainText('Replaced text');
    });
  });

  // ── ADV-E4: Nested iframes ───────────────────────────────────────────
  test.describe('ADV-E4: Nested iframes — outer → inner form', () => {
    test('should display the outer frame on the page', async ({ iframesPage }) => {
      await expect(iframesPage.outerFrame()).toBeVisible();
    });

    test('should submit the inner form and show the submitted result', async ({ iframesPage }) => {
      await iframesPage.submitInnerForm('Alice', 'alice@example.com');
      await expect(iframesPage.innerResult()).toContainText('Alice');
      await expect(iframesPage.innerResult()).toContainText('alice@example.com');
    });

    test('should show the result with no name when name is omitted', async ({ iframesPage }) => {
      await iframesPage.submitInnerForm('', 'test@example.com');
      await expect(iframesPage.innerResult()).toContainText('(no name)');
    });
  });
});
