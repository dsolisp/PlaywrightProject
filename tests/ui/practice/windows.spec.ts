import { test, expect } from '../../../fixtures/test.fixture';

/**
 * ADV-E5 — Open new tab via target="_blank"
 * ADV-E6 — Open new tab via window.open()
 *
 * Playwright can switch to real new browser tabs via context.waitForEvent('page').
 * Law 3: all locators accessed via POM methods — no raw page.locator() in specs.
 */
test.describe('Practice App — New Window / Tab @practice @smoke', () => {
  test.beforeEach(async ({ windowsPage }) => {
    await windowsPage.open();
  });

  // ── ADV-E5: target="_blank" link ────────────────────────────────────
  test.describe('ADV-E5: Open via target="_blank"', () => {
    test('should have the correct href on the new-tab link', async ({ windowsPage }) => {
      await expect(windowsPage.tabLink()).toHaveAttribute('href', /\/windows\/new/);
    });

    test('should open the new window page in a new tab and verify content', async ({
      windowsPage,
      context,
    }) => {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        windowsPage.tabLink().click(),
      ]);
      await newPage.waitForLoadState();
      // Use the POM for the new page assertions (Law 3 — no raw locators in specs)
      const { WindowsPage } = await import('../../../pages');
      const newWindowPom = new WindowsPage(newPage);
      await expect(newWindowPom.newWindowHeading()).toHaveText('New Window');
      await expect(newWindowPom.newWindowBody()).toContainText('opened in a new tab');
      await newPage.close();
    });
  });

  // ── ADV-E6: window.open() ────────────────────────────────────────────
  test.describe('ADV-E6: Open via window.open()', () => {
    test('should open a new tab via window.open() and verify content', async ({
      windowsPage,
      context,
    }) => {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        windowsPage.tabButton().click(),
      ]);
      await newPage.waitForLoadState();
      const { WindowsPage } = await import('../../../pages');
      const newWindowPom = new WindowsPage(newPage);
      await expect(newWindowPom.newWindowHeading()).toHaveText('New Window');
      await newPage.close();
    });

    test('should display the button with visible text', async ({ windowsPage }) => {
      await expect(windowsPage.tabButton()).toBeVisible();
      await expect(windowsPage.tabButton()).toContainText('Open a New Window');
    });
  });
});
