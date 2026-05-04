import { test, expect, authenticatedTest } from '../../fixtures/test.fixture';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { PATHS } from '../../config/constants';

// Hybrid DB Testing Patterns
// Mirror of Cypress database.cy.ts

test.describe('Hybrid DB Testing Patterns @db', () => {
  test.describe.configure({ mode: 'serial' });
  let db: Database.Database;
  const dbPath = path.resolve(process.cwd(), PATHS.DB);

  test.beforeAll(() => {
    // Database seeding is now handled by PlaywrightProject/scripts/seed_db.js
    // or via global setup, but we'll use a direct exec for now or assume it's seeded.
    db = new Database(dbPath, { timeout: 5000 });
    db.pragma('journal_mode = WAL');
  });

  test.afterAll(() => {
    if (db) db.close();
  });

  // ── Example 1: Seed → Login (Precondition) ──────────────────────────
  test('Example 1: Seeds a user then attempts login', async ({ loginPage }) => {
    const testUser = { id: 101, username: 'db_user', password: 'password123' };
    db.prepare('INSERT OR IGNORE INTO users VALUES (?, ?, ?)').run(testUser.id, testUser.username, 'customer');

    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);

    await expect(loginPage.errorMessageLocator()).toBeVisible();
    await expect(loginPage.errorMessageLocator()).toContainText('do not match');
  });

  // ── Example 2: UI Action → DB Verification (Postcondition) ──────────
  test('Example 2: Logs in then verifies user exists in local DB', async ({ loginPage, page }) => {
    const user = { username: 'standard_user', password: 'secret_sauce' };

    await loginPage.open();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(user.username) as { role: string };
    expect(row).toBeDefined();
    expect(row.role).toBeDefined();
  });

  // ── Example 3: DB Data → UI Assertion (Data-Driven) ─────────────────
  test('Example 3: Verifies UI price matches DB price for Backpack', async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    const dbPrice = (db.prepare('SELECT price FROM products WHERE name = ?').get('Sauce Labs Backpack') as { price: number }).price;

    const priceText = await inventoryPage.inventoryItemsLocator().first().locator('.inventory_item_price').innerText();
    expect(priceText).toContain(String(dbPrice));
  });

  // ── Example 4: Data-Driven Login (Iterate from DB) ───────────────────
  test('Example 4: Logs in with every customer-role user from DB', async ({ loginPage, page }) => {
    const users = db.prepare('SELECT * FROM users WHERE role = ? AND username != ?').all('customer', 'db_user') as { username: string }[];

    for (const user of users) {
      await loginPage.open();
      await loginPage.login(user.username, 'secret_sauce');
      await expect(page).toHaveURL(/.*inventory.html/);
      await page.locator('#react-burger-menu-btn').click();
      await page.locator('#logout_sidebar_link').click();
    }
  });

  // ── Example 5: CRUD Lifecycle ─────────────────────────────────────────
  test('Example 5: Create → Read → Delete lifecycle in the local DB', async () => {
    const newUserId = 999;

    // Create
    db.prepare('INSERT OR REPLACE INTO users VALUES (?, ?, ?)').run(newUserId, 'test_cleanup_user', 'tester');

    // Read
    const readRow = db.prepare('SELECT * FROM users WHERE id = ?').get(newUserId) as { username: string };
    expect(readRow).toBeDefined();
    expect(readRow.username).toBe('test_cleanup_user');

    // Delete
    db.prepare('DELETE FROM users WHERE id = ?').run(newUserId);

    // Verify deletion
    const deletedRow = db.prepare('SELECT * FROM users WHERE id = ?').get(newUserId);
    expect(deletedRow).toBeUndefined();
  });
});
