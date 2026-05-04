import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages';
import { UserBuilder } from '../../utils/builders/user.builder';

/**
 * sauce.setup.ts — one-time auth setup (ADR-009 / storageState).
 * Runs once before the main browser projects.
 * Saves browser storage state (cookies + localStorage) to .auth/sauce.json.
 * All tests that depend on the "setup" project reuse this state automatically.
 */

const AUTH_FILE = '.auth/sauce.json';

setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = new UserBuilder().standard().build();

  await loginPage.open();
  await loginPage.login(user.username, user.password);

  // Wait until we've landed on the inventory page (URL changes away from /)
  await page.waitForURL('**/inventory.html');

  // Persist cookies + localStorage to disk — reused by all dependent projects
  await page.context().storageState({ path: AUTH_FILE });
});
