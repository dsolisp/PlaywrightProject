# 🎭 Playwright Test Automation Framework

[![CI](https://github.com/dsolisp/PlaywrightProject/actions/workflows/ci.yml/badge.svg)](https://github.com/dsolisp/PlaywrightProject/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, portfolio-quality test automation framework demonstrating industry best practices for 2026. Built with Playwright, Vitest, and TypeScript.

---

## 🏗️ Architecture (TL;DR)

- **Pages/Locators 1:1 separation**: Pure locator data files mirroring business-logic page objects.
- **Zero locators in specs**: Enforced by strict ESLint guardrails (`no-restricted-syntax`).
- **API seeding for parallel safety**: Using Playwright fixtures for parallel-safe test setup (60x faster).
- **Semantic Locators**: Accessibility-first selectors (`getByRole`, `getByPlaceholder`).
- → [View Full Architecture & ADRs](docs/ARCHITECTURE.md)
- → [Read the "Zero to Hero" Learning Journey](docs/ZERO-TO-HERO.md)

---

## 📊 Test Coverage

| Test Type      | Count   | Framework      |
| -------------- | ------- | -------------- |
| Unit Tests     | 68      | Vitest         |
| Database Tests | 11      | Vitest         |
| E2E Tests      | 78      | Playwright     |
| BDD Tests      | 13      | playwright-bdd |
| **Total**      | **170** |                |

---

## 📋 Prerequisites

- **Node.js 24+** ([Download](https://nodejs.org/))
- **pnpm** (via Corepack; this repo uses `packageManager: pnpm@9.15.9`)
- **Git** ([Download](https://git-scm.com/))
- (Optional) **Allure CLI** for local reporting: `brew install allure`

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/dsolisp/PlaywrightProject.git
cd PlaywrightProject

# Install dependencies
corepack enable
pnpm install --frozen-lockfile

# Install Playwright browsers
pnpm exec playwright install --with-deps chromium

# Run all tests
pnpm test
```

---

## ✨ Key Features

### 🧪 Testing Capabilities

| Feature               | Technology           | Description                                |
| --------------------- | -------------------- | ------------------------------------------ |
| **E2E Web Testing**   | Playwright           | Page Object Model with 1:1 locator pairing |
| **API Testing**       | Playwright Request   | REST API validation and contract testing   |
| **Visual Regression** | Playwright Snapshots | Automated screenshot comparison            |
| **Accessibility**     | axe-core             | WCAG 2.1 AA compliance checking            |
| **BDD Testing**       | playwright-bdd       | Cucumber-style Gherkin syntax              |
| **Unit Testing**      | Vitest               | Fast, modern unit test runner              |
| **Performance**       | Playwright Metrics   | Page load and Core Web Vitals              |

### 🏗️ Architecture Patterns

- **Page Object Model (POM)** - 1:1 Page + Locator file pairing
- **Fixture Pattern** - Reusable test setup with authentication
- **Factory Pattern** - Dynamic test data generation
- **Configuration Management** - Environment-based settings in `lib/config/`

### 🔧 Developer Experience

- **TypeScript** - Full type safety throughout
- **ESLint v9** - Modern flat config with Playwright plugin
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks for quality gates
- **Allure Reports** - Rich HTML test reporting

---

## 🏗️ Project Structure

```
PlaywrightProject/
├── e2e/                          # End-to-end test code
│   ├── fixtures/                 # Playwright test fixtures
│   │   └── test.fixture.ts       # Custom fixtures with auth
│   ├── page-objects/             # Page Object Model classes
│   │   ├── base.page.ts          # Abstract base page
│   │   ├── sauce-demo/           # SauceDemo pages (1:1 pattern)
│   │   │   ├── login.page.ts + login.locators.ts
│   │   │   ├── inventory.page.ts + inventory.locators.ts
│   │   │   ├── cart.page.ts + cart.locators.ts
│   │   │   ├── checkout.page.ts + checkout.locators.ts
│   │   │   └── index.ts          # Barrel exports
│   │   └── search-engine/        # Search engine pages
│   │       ├── search.page.ts + search.locators.ts
│   │       └── index.ts
│   └── specs/                    # All E2E test specs
│       ├── sauce-demo/           # SauceDemo tests
│       ├── search-engine/        # Search engine tests
│       ├── accessibility/        # WCAG accessibility tests
│       ├── api/                  # API integration tests
│       ├── contract/             # API contract tests
│       ├── integration/          # E2E integration tests
│       ├── performance/          # Performance metrics tests
│       └── visual/               # Visual regression tests
│
├── lib/                          # Shared library code
│   ├── config/                   # Configuration management
│   │   ├── constants.ts          # Application constants & credentials
│   │   └── settings.ts           # Environment settings loader
│   └── utils/                    # Shared utilities
│       └── test-data-factory.ts  # Factory pattern for test data
│
├── src/                          # Source utilities
│   └── utils/                    # Core utilities
│       ├── data-manager.ts       # Test data loading (CSV, JSON)
│       ├── database.ts           # SQLite database helper
│       └── logger.ts             # Winston-based structured logging
│
├── tests/                        # Non-E2E tests
│   ├── bdd/                      # Cucumber BDD tests
│   │   ├── features/             # Gherkin feature files
│   │   ├── steps/                # Step definitions
│   │   └── playwright.config.ts  # BDD-specific config
│   ├── database/                 # Database tests (Vitest)
│   └── unit/                     # Unit tests (Vitest)
│
├── test-data/                    # Test data files
│   ├── chinook.db                # SQLite database for database tests
│   ├── users.json                # User test data
│   └── test_users.csv            # CSV test data
│
├── .github/workflows/            # CI/CD pipelines
│   └── ci.yml                    # GitHub Actions workflow
│
├── playwright.config.ts          # Playwright configuration (testDir: ./e2e)
├── vitest.config.ts              # Vitest configuration
├── eslint.config.js              # ESLint flat config
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies & scripts
```

---

## 🧪 Running Tests

### Quick Commands

```bash
# Run all tests (unit + Playwright)
pnpm test

# Unit tests only (Vitest)
pnpm run test:unit

# Playwright E2E tests
pnpm exec playwright test

# Specific test file
pnpm exec playwright test specs/sauce-demo/sauce-demo.spec.ts

# Specific browser
pnpm exec playwright test --project=chromium

# Headed mode (see browser)
pnpm exec playwright test --headed

# Debug mode
pnpm exec playwright test --debug

# Update visual snapshots
pnpm run snapshots:update

# Run by test tag
pnpm exec playwright test --grep @smoke        # Quick validation tests
pnpm exec playwright test --grep @regression   # Full regression suite
pnpm exec playwright test --grep @auth         # Authentication tests
pnpm exec playwright test --grep @cart         # Shopping cart tests
pnpm exec playwright test --grep @checkout     # Checkout flow tests
pnpm exec playwright test --grep @search       # Search engine tests
```

### BDD Tests (Separate Config)

```bash
cd tests/bdd
pnpm exec bddgen                  # Generate test files from features
pnpm exec playwright test         # Run BDD tests
```

### Test Reports

```bash
# View Playwright HTML report
pnpm exec playwright show-report

# Generate Allure report
pnpm run report:allure
```

---

## 🎯 Test Applications

This framework tests two applications:

### 1. SauceDemo (Primary)

- **URL**: https://www.saucedemo.com
- **Purpose**: E-commerce testing demo
- **Tests**: Login, inventory, cart, checkout flows

### 2. Bing Search (Secondary)

- **URL**: https://www.bing.com
- **Purpose**: Search engine automation
- **Tests**: Search, results, navigation
- **Note**: Tests are CAPTCHA-resilient

---

## 📁 Key Files Explained

| File                             | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `playwright.config.ts`           | Browser config, timeouts, reporters      |
| `vitest.config.ts`               | Unit test runner configuration           |
| `e2e/fixtures/test.fixture.ts`   | Custom Playwright fixtures with auth     |
| `e2e/page-objects/base.page.ts`  | Abstract base class for all pages        |
| `lib/config/settings.ts`         | Environment configuration loader         |
| `lib/utils/test-data-factory.ts` | Factory pattern for generating test data |

---

## 🔐 Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# URL Configuration (all URLs are centralized in lib/config/constants.ts)
BASE_URL=https://www.bing.com                    # Search engine for web tests
SAUCE_DEMO_URL=https://www.saucedemo.com         # E-commerce demo app
API_BASE_URL=https://jsonplaceholder.typicode.com # REST API for testing

# Database
DATABASE_PATH=./test-data/chinook.db             # SQLite database for tests

# Logging
LOG_LEVEL=info              # debug, info, warn, error
LOG_TO_FILE=true            # Set to 'false' to disable file logging
LOG_SILENT=false            # Set to 'true' to disable all logging

# Browser
HEADLESS=true               # Set to 'false' for headed mode
BROWSER=chromium            # chromium, firefox, webkit
```

### URL Configuration

All URLs are defined in `lib/config/constants.ts` as the single source of truth:

| URL Constant            | Default                              | Environment Variable | Purpose             |
| ----------------------- | ------------------------------------ | -------------------- | ------------------- |
| `URLS.BING`             | https://www.bing.com                 | `BASE_URL`           | Search engine tests |
| `URLS.SAUCE_DEMO`       | https://www.saucedemo.com            | `SAUCE_DEMO_URL`     | E-commerce UI tests |
| `URLS.JSON_PLACEHOLDER` | https://jsonplaceholder.typicode.com | `API_BASE_URL`       | API tests           |
| `URLS.REQRES`           | https://reqres.in/api                | -                    | Auth API (optional) |

To change URLs for different environments, set the environment variables in `.env` or pass them at runtime.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Run quality checks: `pnpm run lint && pnpm test`
3. Commit with conventional commits: `feat(scope): description`
4. Submit a PR to `main`

### Code Style

- Follow Page Object Model with 1:1 locator pairing
- Add new pages to `e2e/page-objects/<app>/`
- Include unit tests for new utilities
- Update documentation for new features

---

## 🐛 Troubleshooting

| Issue                     | Solution                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser not installed     | `pnpm exec playwright install --with-deps chromium`                                                                                                             |
| Tests timeout on Bing     | Normal - CAPTCHA protection, tests handle gracefully                                                                                                            |
| Visual tests fail         | Run `pnpm run snapshots:update`                                                                                                                                 |
| TypeScript errors         | Run `pnpm run typecheck`                                                                                                                                        |
| ESLint errors             | Run `pnpm run lint` to see issues                                                                                                                               |
| Database tests skip       | Download Chinook DB: `curl -L -o test-data/chinook.db https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite` |
| better-sqlite3 build fail | Ensure you have C++ build tools: macOS: `xcode-select --install`, Linux: `apt install build-essential`                                                          |

---

## 📚 Documentation

- [ZERO-TO-HERO.md](ZERO-TO-HERO.md) - Complete guide to recreate this project from scratch

---

## 🏆 Why This Framework?

This project demonstrates:

✅ **Modern Architecture** - 1:1 POM + Locator pattern, fixtures, factories
✅ **Multi-Layer Testing** - Unit, integration, E2E, visual, accessibility, BDD
✅ **Type Safety** - Full TypeScript with strict mode
✅ **CI/CD Ready** - GitHub Actions with Allure reporting
✅ **Real-World Patterns** - CAPTCHA handling, auth fixtures, data-driven tests
✅ **2025 Best Practices** - ESLint v9, Vitest, Playwright latest

---

## 📄 License

ISC

---

Built with ❤️ using Playwright, TypeScript, and modern testing practices
