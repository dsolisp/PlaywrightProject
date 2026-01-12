# 🎓 Zero-to-Hero: Building a Modern Playwright Test Framework

This tutorial walks you through recreating this entire test automation framework from scratch. Each step explains **what** we're doing, **why** we're doing it, and the **commands** to execute.

---

## Table of Contents

1. [Project Initialization](#1-project-initialization)
2. [TypeScript Configuration](#2-typescript-configuration)
3. [Playwright Setup](#3-playwright-setup)
4. [ESLint & Prettier](#4-eslint--prettier)
5. [Project Structure](#5-project-structure)
6. [Page Object Model](#6-page-object-model)
7. [Custom Fixtures](#7-custom-fixtures)
8. [Unit Testing with Vitest](#8-unit-testing-with-vitest)
9. [Database Testing](#9-database-testing)
10. [Visual Regression Testing](#10-visual-regression-testing)
11. [Accessibility Testing](#11-accessibility-testing)
12. [BDD with Cucumber](#12-bdd-with-cucumber)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [Best Practices](#14-best-practices)

---

## 1. Project Initialization

### What & Why

Every Node.js project starts with `package.json`. This file:

- Defines project metadata (name, version)
- Lists dependencies (libraries we need)
- Contains scripts (shortcuts for common commands)
- Specifies the module system (`"type": "module"` for ES modules)

### Commands

```bash
# Create project directory
mkdir PlaywrightProject && cd PlaywrightProject

# Initialize package.json with defaults
# -y flag accepts all defaults (name from folder, version 1.0.0, etc.)
npm init -y

# Enable ES Modules (modern JavaScript imports)
# This allows using `import/export` instead of `require/module.exports`
npm pkg set type="module"
```

### Understanding the Output

```json
{
  "name": "playwrightproject", // Lowercase, from folder name
  "version": "1.0.0", // Semantic versioning: major.minor.patch
  "type": "module", // Use ES modules (import/export)
  "main": "index.js", // Entry point (not used in test projects)
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## 2. TypeScript Configuration

### What & Why

TypeScript adds static typing to JavaScript, catching errors at compile time instead of runtime. For test automation, this means:

- **Autocomplete** - IDE suggests methods and properties
- **Type Safety** - Catch typos and wrong types before running tests
- **Documentation** - Types serve as inline documentation
- **Refactoring** - Safely rename and restructure code

### Commands

```bash
# Install TypeScript and Node.js type definitions
# --save-dev (-D) means "development dependency" - not needed in production
npm install --save-dev typescript @types/node

# Create tsconfig.json with recommended settings
npx tsc --init
```

### Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022", // Output modern JavaScript
    "module": "NodeNext", // Use Node.js ES module resolution
    "moduleResolution": "NodeNext",
    "strict": true, // Enable all strict type checks
    "esModuleInterop": true, // Better CommonJS/ES module compatibility
    "skipLibCheck": true, // Skip type checking node_modules (faster)
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist", // Compiled JS output directory
    "rootDir": "./src", // Source TypeScript files
    "resolveJsonModule": true, // Allow importing JSON files
    "declaration": true // Generate .d.ts type declaration files
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Key Options Explained

| Option                       | Purpose                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| `strict: true`               | Enables all strict type-checking options                          |
| `esModuleInterop`            | Allows `import axios from 'axios'` instead of `import * as axios` |
| `skipLibCheck`               | Speeds up compilation by not checking node_modules types          |
| `moduleResolution: NodeNext` | Uses Node.js's native ES module resolution                        |

---

## 3. Playwright Setup

### What & Why

Playwright is a modern browser automation library by Microsoft. Compared to Selenium:

- **Faster** - Direct browser protocol communication (no WebDriver)
- **Auto-waits** - No need for explicit waits in most cases
- **Multi-browser** - Chromium, Firefox, WebKit from single API
- **Built-in features** - Screenshots, videos, tracing, network mocking

### Commands

```bash
# Install Playwright Test framework
# This includes the test runner, assertions, and browser automation
npm install --save-dev @playwright/test

# Install browser binaries (Chromium, Firefox, WebKit)
# --with-deps also installs system dependencies (Linux)
npx playwright install --with-deps
```

### Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**', '**/database/**', '**/bdd/**'],
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['allure-playwright']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://www.bing.com',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Why These Settings?

| Setting                        | Reason                                         |
| ------------------------------ | ---------------------------------------------- |
| `fullyParallel`                | Tests run faster by using all CPU cores        |
| `forbidOnly: !!process.env.CI` | Prevents accidentally committing `test.only()` |
| `retries: 2` in CI             | Handles flaky tests from network/timing issues |
| `trace: 'on-first-retry'`      | Captures detailed debug info only when needed  |

---

## 4. ESLint & Prettier

### What & Why

**ESLint** catches code quality issues and potential bugs:

- Unused variables
- Missing await on async functions
- Playwright-specific issues (hardcoded waits, etc.)

**Prettier** handles code formatting:

- Consistent indentation
- Quote style
- Line length

Together, they ensure consistent, high-quality code across the team.

### Commands

```bash
# ESLint v9 with flat config
npm install --save-dev eslint @eslint/js globals

# TypeScript support
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Playwright-specific rules
npm install --save-dev eslint-plugin-playwright

# Prettier integration
npm install --save-dev prettier eslint-plugin-prettier
```

### Configuration (eslint.config.js)

```javascript
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: ['node_modules/**', 'dist/**', 'allure-*/**', 'test-results/**'],
  },

  // Base ESLint rules
  eslint.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright: playwright,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Playwright rules
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-force-option': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
    },
  },
];
```

### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Add Scripts to package.json

```bash
npm pkg set scripts.lint="eslint . --ext .js,.ts"
npm pkg set scripts.format="prettier --write ."
```

---

## 5. Project Structure

### What & Why

A well-organized project structure makes code:

- **Findable** - Know where to look for specific functionality
- **Maintainable** - Changes are isolated to specific areas
- **Scalable** - Easy to add new features without restructuring

### Create Directories

```bash
# E2E test directories (Playwright best practice: 1:1 page object + locator pattern)
mkdir -p e2e/fixtures e2e/page-objects e2e/specs

# Page objects by application
mkdir -p e2e/page-objects/sauce-demo e2e/page-objects/search-engine

# E2E spec directories by type
mkdir -p e2e/specs/sauce-demo e2e/specs/search-engine
mkdir -p e2e/specs/api e2e/specs/visual e2e/specs/accessibility
mkdir -p e2e/specs/integration e2e/specs/performance e2e/specs/contract

# Library code (shared across tests)
mkdir -p lib/config lib/utils

# Source utilities
mkdir -p src/utils

# Non-E2E tests
mkdir -p tests/unit tests/database tests/bdd

# Supporting directories
mkdir -p test-data .github/workflows
```

### Directory Purposes

| Directory           | Purpose                                |
| ------------------- | -------------------------------------- |
| `e2e/fixtures/`     | Playwright custom fixtures             |
| `e2e/page-objects/` | Page Object Model with paired locators |
| `e2e/specs/`        | All E2E test specifications            |
| `lib/config/`       | Configuration and environment settings |
| `lib/utils/`        | Shared utilities (factories, etc.)     |
| `src/utils/`        | Core utilities (logger, data, db)      |
| `tests/unit/`       | Unit tests (Vitest)                    |
| `tests/database/`   | Database tests (Vitest)                |
| `tests/bdd/`        | Cucumber/Gherkin tests                 |

---

## 6. Page Object Model

### What & Why

Page Object Model (POM) is a design pattern that:

- **Encapsulates** page structure and behavior
- **Reduces duplication** - Locators defined once
- **Improves maintainability** - UI changes only affect page class
- **Increases readability** - Tests read like user stories

**Best Practice: 1:1 Page Object + Locator Pattern**

Each page object file has a paired locator file in the same directory:

```
e2e/page-objects/sauce-demo/
├── login.page.ts         # Page object with methods
├── login.locators.ts     # Locator definitions
├── inventory.page.ts
├── inventory.locators.ts
└── index.ts              # Barrel exports
```

### Locator File (e2e/page-objects/sauce-demo/login.locators.ts)

```typescript
/**
 * Locators for the SauceDemo login page.
 * Single source of truth for all login-related selectors.
 */
export const LoginLocators = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
} as const;
```

### Base Page Class (e2e/page-objects/base.page.ts)

```typescript
import { Page, Locator } from '@playwright/test';
import { logger } from '../../src/utils/logger.js';

/**
 * Abstract base class for all page objects.
 * Provides common functionality like navigation, waiting, and logging.
 */
export abstract class BasePage {
  abstract readonly url: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    const startTime = Date.now();
    await this.page.goto(this.url);
    const duration = Date.now() - startTime;
    logger.info(`Navigated to ${this.url}`, { durationMs: duration });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForVisible(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }
}
```

### Concrete Page Class (e2e/page-objects/sauce-demo/login.page.ts)

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page.js';
import { LoginLocators } from './login.locators.js';

export class LoginPage extends BasePage {
  readonly url = 'https://www.saucedemo.com';

  // Locators as class properties using paired locator file
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(LoginLocators.usernameInput);
    this.passwordInput = page.locator(LoginLocators.passwordInput);
    this.loginButton = page.locator(LoginLocators.loginButton);
    this.errorMessage = page.locator(LoginLocators.errorMessage);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.textContent() ?? '';
  }
}
```

---

## 7. Custom Fixtures

### What & Why

Playwright fixtures provide:

- **Setup/teardown** automation
- **Dependency injection** - Pages, authenticated sessions
- **Reusability** - Share setup across tests
- **Isolation** - Each test gets fresh state

### Creating Custom Fixtures (e2e/fixtures/test.fixture.ts)

```typescript
import { test as base } from '@playwright/test';
import {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
} from '../page-objects/sauce-demo/index.js';
import { SearchPage } from '../page-objects/search-engine/index.js';
import { CREDENTIALS } from '../../lib/config/constants.js';

// Define custom fixture types
type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  searchPage: SearchPage;
  authenticatedPage: InventoryPage; // Pre-logged in
};

// Extend base test with custom fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  // Authenticated fixture - pre-logged in
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(CREDENTIALS.STANDARD_USER, CREDENTIALS.PASSWORD);
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
```

### Using Fixtures in Tests

```typescript
import { test, expect } from '../../fixtures/test.fixture.js';

test.describe('Inventory Tests', () => {
  // Uses authenticatedPage fixture - already logged in!
  test('should display products', async ({ authenticatedPage }) => {
    const products = await authenticatedPage.getProductNames();
    expect(products.length).toBeGreaterThan(0);
  });
});
```

---

## 8. Unit Testing with Vitest

### What & Why

**Vitest** is a modern alternative to Jest:

- **Faster** - Uses Vite's transformation pipeline
- **ESM Native** - No configuration needed for ES modules
- **Compatible** - Jest-like API, easy migration
- **Watch Mode** - Instant feedback during development

### Installation

```bash
npm install --save-dev vitest
```

### Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Use global test, expect, describe
    environment: 'node', // Node.js environment
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

### Writing Unit Tests

```typescript
// tests/unit/logger.test.ts
import { describe, it, expect, vi } from 'vitest';
import { logger } from '../../src/utils/logger';

describe('Logger', () => {
  it('should log info messages', () => {
    const spy = vi.spyOn(console, 'log');
    logger.info('Test message');
    expect(spy).toHaveBeenCalled();
  });

  it('should include metadata', () => {
    const output = logger.formatMessage('info', 'Test', { userId: 123 });
    expect(output).toContain('userId');
  });
});
```

### Add Script

```bash
npm pkg set scripts.test:unit="vitest run tests/unit/"
```

---

## 9. Database Testing

### What & Why

Database testing validates:

- **Data integrity** - Queries return expected results
- **Schema correctness** - Tables and columns exist as expected
- **CRUD operations** - Create, Read, Update, Delete work correctly
- **Edge cases** - NULL handling, empty results, large datasets

### Installation

```bash
# Install better-sqlite3 (synchronous SQLite for Node.js)
npm install --save-dev better-sqlite3 @types/better-sqlite3

# Download sample database (Chinook - music store)
curl -L -o test-data/chinook.db \
  https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
```

### Database Helper (src/utils/database.ts)

```typescript
import Database from 'better-sqlite3';
import path from 'path';

export function createDatabaseConnection(dbPath?: string): Database.Database {
  const resolvedPath = dbPath || process.env.DATABASE_PATH || './test-data/chinook.db';
  return new Database(path.resolve(resolvedPath));
}

export function closeDatabase(db: Database.Database): void {
  db.close();
}
```

### Writing Database Tests

```typescript
// tests/database/chinook.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import { createDatabaseConnection } from '../../src/utils/database';

describe('Chinook Database', () => {
  let db: Database.Database;

  beforeAll(() => {
    db = createDatabaseConnection();
  });

  afterAll(() => {
    db.close();
  });

  it('should query artists', () => {
    const artists = db.prepare('SELECT * FROM Artist LIMIT 5').all();
    expect(artists).toHaveLength(5);
    expect(artists[0]).toHaveProperty('Name');
  });

  it('should find albums by artist', () => {
    const albums = db
      .prepare(
        `
      SELECT Album.Title, Artist.Name
      FROM Album
      JOIN Artist ON Album.ArtistId = Artist.ArtistId
      WHERE Artist.Name = ?
    `,
      )
      .all('AC/DC');

    expect(albums.length).toBeGreaterThan(0);
  });
});
```

### Add Script

```bash
npm pkg set scripts.test:db="vitest run tests/database/"
```

---

## 10. Visual Regression Testing

### What & Why

Visual regression tests:

- **Capture screenshots** of pages/components
- **Compare against baselines** - Detect visual changes
- **Prevent regressions** - Catch unintended UI changes

Playwright has built-in visual comparison (no need for pixelmatch).

### Writing Visual Tests

```typescript
// e2e/specs/visual/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match baseline', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // Takes screenshot and compares to baseline
    // First run creates the baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('login button should match', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    const button = page.locator('#login-button');

    // Screenshot specific element
    await expect(button).toHaveScreenshot('login-button.png');
  });
});
```

### Commands

```bash
# Run visual tests (compares to baselines)
npx playwright test specs/visual/

# Update baselines after intentional changes
npx playwright test specs/visual/ --update-snapshots
```

---

## 11. Accessibility Testing

### What & Why

Accessibility testing ensures your app works for users with disabilities:

- **Screen readers** - Blind users
- **Keyboard navigation** - Motor impairments
- **Color contrast** - Visual impairments

**axe-core** is the industry standard for automated accessibility testing.

### Installation

```bash
npm install --save-dev @axe-core/playwright
```

### Writing Accessibility Tests

```typescript
// e2e/specs/accessibility/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage should have no violations', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']) // WCAG 2.1 AA
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('login form should be accessible', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const results = await new AxeBuilder({ page })
      .include('#login_button_container') // Specific component
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

---

## 12. BDD with Cucumber

### What & Why

Behavior-Driven Development (BDD):

- **Gherkin syntax** - Human-readable test scenarios
- **Stakeholder collaboration** - Non-technical team members can write specs
- **Living documentation** - Tests serve as feature documentation

### Installation

```bash
npm install --save-dev playwright-bdd
```

### Feature File (tests/bdd/features/login.feature)

```gherkin
Feature: User Login
  As a user
  I want to log in to SauceDemo
  So that I can access the store

  @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "standard_user"
    And I enter password "secret_sauce"
    And I click the login button
    Then I should see the inventory page

  @negative
  Scenario: Login fails with invalid password
    Given I am on the login page
    When I enter username "standard_user"
    And I enter password "wrong_password"
    And I click the login button
    Then I should see an error message
```

### Step Definitions (tests/bdd/steps/login.steps.ts)

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the login page', async function () {
  await this.page.goto('https://www.saucedemo.com');
});

When('I enter username {string}', async function (username: string) {
  await this.page.fill('#user-name', username);
});

When('I enter password {string}', async function (password: string) {
  await this.page.fill('#password', password);
});

When('I click the login button', async function () {
  await this.page.click('#login-button');
});

Then('I should see the inventory page', async function () {
  await expect(this.page).toHaveURL(/inventory/);
});

Then('I should see an error message', async function () {
  const error = this.page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
});
```

### Running BDD Tests

```bash
cd tests/bdd
npx bddgen              # Generate Playwright tests from features
npx playwright test     # Run generated tests
```

---

## 13. CI/CD Pipeline

### What & Why

Continuous Integration ensures:

- **Every commit is tested** - Catch issues early
- **Consistent environment** - Same results locally and in CI
- **Quality gates** - Block broken code from merging

### GitHub Actions Workflow (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run linting
        run: npm run lint

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Run unit tests
        run: npm run test:unit

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 14. Best Practices

### Locator Strategy (Priority Order)

1. **data-testid** - Most stable, intended for testing
2. **Role** - Accessible, semantic (`getByRole('button')`)
3. **Text** - User-facing, catches UX issues (`getByText('Submit')`)
4. **CSS/ID** - Last resort, fragile

```typescript
// ✅ Best
page.getByTestId('submit-button');
page.getByRole('button', { name: 'Submit' });

// ⚠️ Acceptable
page.locator('#submit-btn');

// ❌ Avoid
page.locator('div.container > form > button:nth-child(3)');
```

### Test Independence

```typescript
// ✅ Each test is independent
test('should add item to cart', async ({ authenticatedPage }) => {
  await authenticatedPage.addToCart('Backpack');
  expect(await authenticatedPage.getCartCount()).toBe(1);
});

// ❌ Tests depend on each other
test('should add item', async ({ page }) => {
  /* adds item */
});
test('should show item in cart', async ({ page }) => {
  /* assumes item exists */
});
```

### Async/Await Consistency

```typescript
// ✅ Always await Playwright actions
await page.click('#button');
await expect(page.locator('#result')).toBeVisible();

// ❌ Missing await causes race conditions
page.click('#button'); // Test continues before click completes
```

### Error Handling

```typescript
// ✅ Graceful degradation for external sites
test('should search', async ({ page }) => {
  await page.goto('https://www.bing.com');
  await page.fill('#sb_form_q', 'playwright');
  await page.click('#search_icon');

  // Handle potential CAPTCHA
  const bodyText = await page.locator('body').innerText();
  if (bodyText.includes('verify') || bodyText.includes('CAPTCHA')) {
    console.log('CAPTCHA detected - skipping assertion');
    return;
  }

  await expect(page.locator('#b_results')).toBeVisible();
});
```

---

## 🎉 Congratulations!

You've learned how to build a modern Playwright test framework from scratch. Key takeaways:

1. **TypeScript** adds type safety and better IDE support
2. **Page Object Model** makes tests maintainable
3. **Fixtures** provide reusable setup and authentication
4. **Multiple test types** (unit, E2E, visual, accessibility) give comprehensive coverage
5. **CI/CD** ensures consistent quality

### Next Steps

- Add more page objects for your application
- Write data-driven tests with test data files
- Implement API mocking for isolated testing
- Add performance metrics collection
- Explore Playwright's network interception

Happy testing! 🚀
