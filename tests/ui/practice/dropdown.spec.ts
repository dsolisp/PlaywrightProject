import { test, expect } from '../../../fixtures/test.fixture';

/**
 * ADV-E1 — Static dropdown
 * ADV-E2 — Dynamic dropdown (async options with 1.5 s simulated delay)
 *
 * Law 3: all locators accessed via POM methods — no raw page.locator() in specs.
 */
test.describe('Practice App — Dropdown @practice @smoke', () => {
  test.beforeEach(async ({ dropdownPage }) => {
    await dropdownPage.open();
  });

  // ── ADV-E1: Static dropdown ──────────────────────────────────────────
  test.describe('ADV-E1: Static dropdown', () => {
    test('should show the static dropdown on page load', async ({ dropdownPage }) => {
      await expect(dropdownPage.staticDropdown()).toBeVisible();
    });

    test('should select Option 1 and update the status', async ({ dropdownPage }) => {
      await dropdownPage.selectStatic('1');
      await expect(dropdownPage.staticStatus()).toContainText('Option 1');
    });

    test('should select Option 2 and update the status', async ({ dropdownPage }) => {
      await dropdownPage.selectStatic('2');
      await expect(dropdownPage.staticStatus()).toContainText('Option 2');
    });

    test('should select Option 3 and update the status', async ({ dropdownPage }) => {
      await dropdownPage.selectStatic('3');
      await expect(dropdownPage.staticStatus()).toContainText('Option 3');
    });
  });

  // ── ADV-E2: Dynamic dropdown ─────────────────────────────────────────
  test.describe('ADV-E2: Dynamic dropdown (async load)', () => {
    test('should start disabled while loading', async ({ dropdownPage }) => {
      // Check immediately on load — the dropdown starts disabled
      await expect(dropdownPage.dynamicDropdown()).toBeDisabled();
      await expect(dropdownPage.dynamicStatus()).toContainText('Fetching');
    });

    test('should become enabled and show options after async load', async ({ dropdownPage }) => {
      // Dynamic options load after ~1.5 s — Playwright auto-waits
      await expect(dropdownPage.dynamicDropdown()).toBeEnabled();
      await expect(dropdownPage.dynamicStatus()).toContainText('loaded');
    });

    test('should select a dynamic option after load and update status', async ({
      dropdownPage,
    }) => {
      await expect(dropdownPage.dynamicDropdown()).toBeEnabled();
      await dropdownPage.selectDynamic('1');
      await expect(dropdownPage.dynamicStatus()).not.toContainText('Fetching');
    });
  });
});
