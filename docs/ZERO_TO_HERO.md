# 🎓 Zero-to-Hero: Building a Modern Playwright Test Framework

This tutorial walks you through recreating this entire test automation framework from scratch. Each step explains **what** we're doing, **why** we're doing it, and the **commands** to execute.

> **Portfolio naming:** The canonical tutorial file in this repo is **`docs/ZERO_TO_HERO.md`** (underscore), aligned with Cypress, Java, C#, and Python sibling projects. If you followed an older link to `docs/ZERO-TO-HERO.md`, that path remains as a **stub** that points here.

> **Note (this repository uses pnpm):** Some historical snippets use `npm` / `npx` because they’re widely known.  
> For consistency with this repo and CI, prefer:
>
> - `npm ci` / `npm install` → `pnpm install` (use `pnpm install --frozen-lockfile` in CI)
> - `npm install --save-dev <pkg>` → `pnpm add -D <pkg>`
> - `npx <bin>` → `pnpm exec <bin>`
>
> If pnpm isn’t available: `corepack enable`.

---

## Table of Contents

- [x] Chapter 1: Project Initialization
- [x] Chapter 2: TypeScript Configuration
- [x] Chapter 3: Playwright Setup
- [x] Chapter 4: ESLint & Prettier
- [x] Chapter 5: Project Structure
- [x] Chapter 6: Page Object Model
- [x] Chapter 7: Locator Separation (NEW)
- [x] Chapter 8: Fixtures over Globals
- [x] Chapter 9: API Seeding (NEW)
- [x] Chapter 10: Unit Testing with Vitest
- [x] Chapter 11: Database Testing
- [x] Chapter 12: Visual Regression Testing
- [x] Chapter 13: Accessibility Testing
- [x] Chapter 14: BDD with Cucumber
- [x] Chapter 15: ESLint Architecture Rules (NEW)
- [x] Chapter 16: CI/CD Pipeline
- [x] Chapter 17: Best Practices

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

# This repository uses pnpm via Corepack (see packageManager in package.json)
corepack enable

# Initialize package.json with defaults
# -y flag accepts all defaults (name from folder, version 1.0.0, etc.)
pnpm init -y

# Enable ES Modules (modern JavaScript imports)
# This allows using `import/export` instead of `require/module.exports`
pnpm pkg set type="module"
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
pnpm add -D typescript @types/node

# Create tsconfig.json with recommended settings
pnpm exec tsc --init
```

### Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "lib": ["ES2021", "DOM"],
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "tests/**/*.ts",
    "pages/**/*.ts",
    "locators/**/*.ts",
    "components/**/*.ts",
    "fixtures/**/*.ts",
    "utils/**/*.ts",
    "config/**/*.ts",
    "playwright.config.ts",
    "vitest.config.ts",
    "scripts/**/*.ts"
  ],
  "exclude": ["node_modules", "dist", "test-results"]
}
```

### Key Options Explained

| Option                       | Purpose                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| `strict: true`               | Enables all strict type-checking options                          |
| `esModuleInterop`            | Allows `import axios from 'axios'` instead of `import * as axios` |
| `skipLibCheck`               | Speeds up compilation by not checking node_modules types          |
| `module: "commonjs"`        | Matches this repo’s current `tsconfig` (Playwright/Vitest tooling) |
| `declaration` + `sourceMap`  | Better jump-to-definition and debugging across tests and pages     |

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
pnpm add -D @playwright/test

# Install browser binaries
# --with-deps also installs system dependencies (Linux)
pnpm exec playwright install --with-deps chromium
```

### Configuration (`playwright.config.ts`)

This repo’s config matches the **checked-in** file: Chromium + auth setup project, timeouts/reporters from shared constants, and **no** Firefox/WebKit projects unless you add them.

```typescript
import { defineConfig, devices } from '@playwright/test';
import { URLS, TIMEOUTS } from './config/constants';

const AUTH_FILE = '.auth/sauce.json';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**', '**/bdd/**'],
  timeout: TIMEOUTS.DEFAULT,
  expect: { timeout: TIMEOUTS.EXPECT },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['allure-playwright'],
    ['json', { outputFile: 'data/results/playwright-results.json' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || URLS.SAUCE_DEMO,
    actionTimeout: TIMEOUTS.ACTION,
    navigationTimeout: TIMEOUTS.NAVIGATION,
    testIdAttribute: 'data-test',
    ignoreHTTPSErrors: true,
  },
  projects: [
    { name: 'setup', testMatch: 'auth/*.setup.ts' },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
    },
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
# ESLint v9 with flat config (pnpm)
pnpm add -D eslint @eslint/js globals

# TypeScript support
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Playwright-specific rules
pnpm add -D eslint-plugin-playwright

# Prettier integration
pnpm add -D prettier eslint-plugin-prettier
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
pnpm pkg set scripts.lint="eslint ."
pnpm pkg set scripts.format="prettier --write ."
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
# Core framework structure (Flat 2026 pattern)
mkdir -p pages/sauce-demo pages/search-engine
mkdir -p locators/sauce-demo locators/search-engine
mkdir fixtures config utils

# Tests structure (matches this repository)
mkdir -p tests/ui/sauce tests/ui/practice tests/ui/visual
mkdir -p tests/backend tests/integration tests/performance tests/accessibility
mkdir -p tests/auth tests/unit tests/bdd

# Supporting directories
mkdir -p test-data docs .github/workflows
```

### Directory Purposes

| Directory         | Purpose                                       |
| ----------------- | --------------------------------------------- |
| `pages/`          | Page Object Model classes (business logic)    |
| `locators/`       | Pure locator data classes (mirrors `pages/`)  |
| `fixtures/`       | Playwright custom fixtures                    |
| `tests/`          | All tests (E2E, unit, BDD, visual, API, etc.) |
| `config/`         | Configuration and constants                   |
| `utils/`          | Shared utilities (logger, factories, db)      |
| `docs/`           | Documentation, ADRs, learning journey         |
| `test-data/`      | Static test data files (JSON, CSV, SQLite)    |
| `tests/unit/`     | Unit tests (Vitest)                           |
| `tests/backend/`  | API / schema-style checks (Playwright)      |
| `tests/bdd/`      | Cucumber/Gherkin tests                        |

---

## 6. Page Object Model

### What & Why

Page Object Model (POM) is a design pattern that:

- **Encapsulates** page structure and behavior
- **Reduces duplication** - Locators defined once
- **Improves maintainability** - UI changes only affect page class
- **Increases readability** - Tests read like user stories

**Best practice (this repo): 1:1 page + locator classes**

Page objects live under `pages/`; locator classes live under `locators/` (mirrored folders, e.g. `sauce-demo/`).

```
pages/sauce-demo/
├── login.page.ts
├── inventory.page.ts
└── index.ts

locators/sauce-demo/
├── login.locators.ts
├── inventory.locators.ts
└── ...
```

### Locator class (`locators/sauce-demo/login.locators.ts`)

```typescript
import type { Page } from '@playwright/test';

/** Semantic locators — getters return fresh Locator references. */
export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() {
    return this.page.getByPlaceholder('Username');
  }
  get passwordInput() {
    return this.page.getByPlaceholder('Password');
  }
  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }
  get errorMessage() {
    return this.page.getByTestId('error');
  }
}
```

### Base page (`pages/base.page.ts`)

```typescript
import type { Page } from '@playwright/test';

/** Minimal shared surface — real pages add behavior; tests assert. */
export abstract class BasePage {
  constructor(readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
```

### Concrete page (`pages/sauce-demo/login.page.ts`)

```typescript
import type { Page } from '@playwright/test';
import { settings } from '../../config/settings';
import { LoginLocators } from '../../locators/sauce-demo/login.locators';
import { BasePage } from '../base.page';

export class LoginPage extends BasePage {
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  async open(): Promise<this> {
    await this.page.goto(settings().sauceDemoUrl, { waitUntil: 'domcontentloaded' });
    return this;
  }

  async login(username: string, password: string): Promise<void> {
    await this.locators.usernameInput.fill(username);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.locators.errorMessage.textContent()) ?? '';
  }
}
```

---

## 7. Locator Separation (NEW)

### What & Why

In earlier versions of this framework, Locators and Page Objects were in the same file. We separated them into pure data classes (`locators/`) and business logic (`pages/`).

Why?

- **Separation of Concerns**: Locators define _what_ elements are. Pages define _how_ to interact with them.
- **Lazy Evaluation**: Using `get` accessors ensures a fresh Locator reference is evaluated every time, avoiding stale element exceptions during retries.

> 💡 **Lesson Learned**: Separating Locators and Pages 1:1 prevents bloated Page Object files and makes UI updates easier to maintain.
> 🚫 **Anti-pattern**: Returning raw Locator objects to specs, encouraging spec files to do assertions directly on locators.
> ✅ **2026 Best Practice**: Keep `pages/` and `locators/` perfectly mirrored.

---

## 8. Custom Fixtures

### What & Why

Playwright fixtures provide:

- **Setup/teardown** automation
- **Dependency injection** - Pages, authenticated sessions
- **Reusability** - Share setup across tests
- **Isolation** - Each test gets fresh state

### Creating custom fixtures (`fixtures/test.fixture.ts`)

The real implementation:

- Extends Playwright’s `test` with **page object fixtures** (`loginPage`, `inventoryPage`, … plus practice-app pages).
- Wraps `page` with **OpenTelemetry** span + attachments (trace id).
- Exports **`authenticatedTest`** for flows that assume **storage state** from `.auth/sauce.json` (see `auth/sauce.setup.ts` + `playwright.config.ts`).

Read the full file in the repo; a shortened shape looks like:

```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages';
import { URLS } from '../config/constants';
// … plus practice pages, configureTracing, etc.

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  // …
});

export const authenticatedTest = test.extend({
  authenticatedPage: async ({ page, inventoryPage }, use) => {
    await page.goto(`${URLS.SAUCE_DEMO}/inventory.html`);
    await use(inventoryPage);
  },
});

export { expect };
```

### Using fixtures in tests

```typescript
import { authenticatedTest, expect } from '../../fixtures/test.fixture';

authenticatedTest('should display products', async ({ authenticatedPage }) => {
  const names = await authenticatedPage.getProductNames();
  expect(names.length).toBeGreaterThan(0);
});
```

---

## 9. API Seeding (NEW)

### What & Why

Performing UI actions to set up test state (e.g. logging in, adding items to the cart) is slow and flaky.
An API call takes milliseconds compared to seconds for the UI.

We use `APIRequestContext` to seed the database or state before the UI test runs.
This ensures parallel safety because the data setup is scoped to the context.

> 💡 **Lesson Learned**: API seeding drops test setup time significantly and allows 100% parallel test execution.
> 🚫 **Anti-pattern**: Clicking through the UI login for every single test.
> ✅ **2026 Best Practice**: Setup state via API. Act and Assert via UI.

---

## 10. Unit Testing with Vitest

### What & Why

**Vitest** is a modern alternative to Jest:

- **Faster** - Uses Vite's transformation pipeline
- **ESM Native** - No configuration needed for ES modules
- **Compatible** - Jest-like API, easy migration
- **Watch Mode** - Instant feedback during development

### Installation

```bash
pnpm add -D vitest
```

### Configuration (`vitest.config.ts`)

This repo’s Vitest config keeps **unit tests** under `tests/unit/**/*.test.ts`, excludes generated BDD output, and wires path aliases (`@config`, `@pages`, `@utils`, `@fixtures`, `@test-data`) for imports. See the checked-in `vitest.config.ts` for the full `coverage.include` list.

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'tests/bdd/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['config/**/*.ts', 'pages/**/*.ts', 'locators/**/*.ts', 'utils/**/*.ts', 'fixtures/**/*.ts'],
      exclude: ['**/*.d.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './config'),
      '@pages': path.resolve(__dirname, './pages'),
      '@utils': path.resolve(__dirname, './utils'),
      '@fixtures': path.resolve(__dirname, './fixtures'),
      '@test-data': path.resolve(__dirname, './test-data'),
    },
  },
});
```

### Writing unit tests

```typescript
// tests/unit/example.test.ts
import { describe, it, expect } from 'vitest';
import { logger } from '@utils/logger';

describe('Logger', () => {
  it('exposes winston logger API', () => {
    expect(typeof logger.info).toBe('function');
    expect(logger.level).toBeDefined();
  });
});
```

### Run unit tests

```bash
pnpm run test:unit
```

---

## 11. Database testing (Playwright + SQLite)

### What & Why

In this repo, **database checks run as Playwright tests** (not Vitest): you can seed SQLite, drive the UI, then assert on DB state—or the reverse. Shared helpers live in `utils/database.ts` (read-only file DB via `settings().databasePath`, optional Chinook sample).

- **Hybrid flows** — seed → login, or UI action → DB verification (`tests/backend/database.spec.ts`)
- **Schema / API-style checks** — `tests/backend/schema-validation.spec.ts` (see `pnpm run test:schema-validation`)

### Dependencies & sample data

`better-sqlite3` is already a dev dependency. For workflows that expect a **file** database (see README troubleshooting), download Chinook:

```bash
curl -L -o test-data/chinook.db \
  https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite
```

### Helper (`utils/database.ts`)

The real module exposes `getDatabase`, `query`, `queryOne`, `closeDatabase`, etc., and resolves the path from `config/settings` (`DATABASE_PATH` / default `./test-data/chinook.db`). Open `utils/database.ts` in the repo rather than duplicating it here.

### Example suite shape

`tests/backend/database.spec.ts` uses an **in-memory** DB, `scripts/seed_db.ts`, and fixtures such as `loginPage`—mirroring the Cypress “hybrid DB” pattern. Run:

```bash
pnpm run test:backend
```

---

## 12. Visual Regression Testing

### What & Why

Visual regression tests:

- **Capture screenshots** of pages/components
- **Compare against baselines** - Detect visual changes
- **Prevent regressions** - Catch unintended UI changes

Playwright has built-in visual comparison (no need for pixelmatch).

### Writing visual tests

Real tests live under `tests/ui/visual/visual-regression.spec.ts`: they use **`fixtures/test.fixture`** (`test` / `authenticatedTest`) and **POM locators** (Law 3: no raw `page.locator` in specs).

```typescript
// tests/ui/visual/visual-regression.spec.ts (abbreviated)
import { test, expect, authenticatedTest } from '../../../fixtures/test.fixture';

test.describe('Visual Regression Testing @visual', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should match baseline for default login page', async ({ loginPage, page }) => {
    await expect(loginPage.loginButtonLocator()).toBeVisible();
    await expect(page).toHaveScreenshot('login-page-default-state.png');
  });
});
```

### Commands

```bash
pnpm run test:visual
pnpm run snapshots:update
```

---

## 13. Accessibility Testing

### What & Why

Accessibility testing ensures your app works for users with disabilities:

- **Screen readers** - Blind users
- **Keyboard navigation** - Motor impairments
- **Color contrast** - Visual impairments

**axe-core** is the industry standard for automated accessibility testing.

### Installation

```bash
pnpm add -D @axe-core/playwright
```

(`@axe-core/playwright` is already in this repo’s `package.json`.)

### Writing accessibility tests

See `tests/accessibility/accessibility.spec.ts`: imports `test`/`expect` from **`fixtures/test.fixture`**, uses `settings().baseUrl`, and applies pragmatic thresholds for third-party pages.

```typescript
// tests/accessibility/accessibility.spec.ts (abbreviated)
import { test, expect } from '../../fixtures/test.fixture';
import AxeBuilder from '@axe-core/playwright';
import { settings } from '../../config/settings';

test('should not have critical accessibility violations on homepage', async ({ page }) => {
  await page.goto(settings().baseUrl);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.length).toBeLessThanOrEqual(10);
});
```

```bash
pnpm run test:a11y
```

---

## 14. BDD with Cucumber

### What & Why

Behavior-Driven Development (BDD):

- **Gherkin syntax** - Human-readable test scenarios
- **Stakeholder collaboration** - Non-technical team members can write specs
- **Living documentation** - Tests serve as feature documentation

### Installation

```bash
pnpm add -D playwright-bdd
```

(`playwright-bdd` is already listed in this repo; step defs use `createBdd` from `playwright-bdd`—open `tests/bdd/steps/*.ts`. Cucumber is pulled in transitively.)

### Feature file (`tests/bdd/features/login.feature`)

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

### Step definitions

This repo uses **`createBdd`** from `playwright-bdd` (see `tests/bdd/steps/login.steps.ts`, `cart.steps.ts`, `checkout.steps.ts`) rather than raw `@cucumber/cucumber` world callbacks in the tutorial style below. Treat the following as **conceptual** Gherkin wiring; copy patterns from the checked-in steps.

### Running BDD tests

From `tests/bdd` (see CI: `full-tests.yml` / `nightly.yml`):

```bash
cd tests/bdd
pnpm exec bddgen
pnpm exec playwright test
```

---

## 15. ESLint Architecture Rules (NEW)

### What & Why

We want our architecture to scale. It's easy for developers to accidentally leak a `page.getByRole` inside a spec file, defeating the purpose of Page Objects.
We enforce our rules using ESLint's `no-restricted-syntax`.

```javascript
// eslint.config.js
{
  files: ['tests/**/*.spec.ts'],
  rules: {
    'no-restricted-syntax': ['error', {
      selector: 'CallExpression[callee.property.name=/^(getByRole|getByText|getByLabel|locator)$/]',
      message: '❌ No locators in specs. Use page objects.'
    }]
  }
}
```

> 💡 **Lesson Learned**: Documentation is ignored; automated rules are followed.
> 🚫 **Anti-pattern**: Relying purely on code reviews to catch architectural violations.
> ✅ **2026 Best Practice**: Bake architecture guardrails directly into the linter.

---

## 16. CI/CD Pipeline

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
      - uses: actions/checkout@v5

      - name: Setup Node.js
        uses: actions/setup-node@v5
        with:
          node-version: '24'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v5
        with:
          run_install: false

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run linting
        run: pnpm run lint

      - name: Run TypeScript check
        run: pnpm run typecheck

      - name: Run unit tests
        run: pnpm run test:unit

      - name: Run Playwright tests
        run: pnpm exec playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 17. Best Practices

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

### Error handling

```typescript
// ✅ Prefer deterministic apps under your control (e.g. SauceDemo + POM)
test('should show login error for bad password', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login('standard_user', 'not_the_real_password');
  await expect(loginPage.errorMessageLocator()).toBeVisible();
});
```

Avoid **search-engine or bot-gated** flows in automated suites; they introduce CAPTCHA and flaky selectors unrelated to your product.

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
