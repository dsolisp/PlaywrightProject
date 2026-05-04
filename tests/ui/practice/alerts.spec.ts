import { test, expect } from '../../../fixtures/test.fixture';

/**
 * ADV-E7 — Simple alert
 * ADV-E8 — Confirm dialog
 * ADV-E9 — Prompt dialog
 *
 * Law 3: all locators accessed via POM methods — no raw page.locator() in specs.
 * Law 2: assertions visible here in the spec, not hidden inside the page.
 */
test.describe('Practice App — JS Alerts @practice @smoke', () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.open();
  });

  // ── ADV-E7: Simple alert ──────────────────────────────────────────────
  test.describe('ADV-E7: Simple alert', () => {
    test('should dismiss alert automatically and update result text', async ({ alertsPage }) => {
      let alertText = '';
      alertsPage.page.once('dialog', async (dialog) => {
        alertText = dialog.message();
        await dialog.accept();
      });
      await alertsPage.triggerAlertButton().click();
      expect(alertText).toBe('This is a simple alert!');
      await expect(alertsPage.resultText()).toHaveText('Alert accepted.');
    });
  });

  // ── ADV-E8: Confirm dialog ────────────────────────────────────────────
  test.describe('ADV-E8: Confirm dialog', () => {
    test('should update result text when user accepts', async ({ alertsPage }) => {
      alertsPage.page.once('dialog', async (dialog) => {
        await dialog.accept();
      });
      await alertsPage.triggerConfirmButton().click();
      await expect(alertsPage.resultText()).toHaveText('Confirm accepted.');
    });

    test('should update result text when user dismisses', async ({ alertsPage }) => {
      alertsPage.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
      await alertsPage.triggerConfirmButton().click();
      await expect(alertsPage.resultText()).toHaveText('Confirm dismissed.');
    });
  });

  // ── ADV-E9: Prompt dialog ─────────────────────────────────────────────
  test.describe('ADV-E9: Prompt dialog', () => {
    test('should echo the entered text in the result', async ({ alertsPage }) => {
      alertsPage.page.once('dialog', async (dialog) => {
        await dialog.accept('Daniel');
      });
      await alertsPage.triggerPromptButton().click();
      await expect(alertsPage.resultText()).toContainText('Daniel');
    });

    test('should show dismissed message when prompt is cancelled', async ({ alertsPage }) => {
      alertsPage.page.once('dialog', async (dialog) => {
        await dialog.dismiss();
      });
      await alertsPage.triggerPromptButton().click();
      await expect(alertsPage.resultText()).toHaveText('Prompt dismissed.');
    });
  });
});
