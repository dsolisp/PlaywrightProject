# 🎭 Playwright Test Automation Framework

[![CI](https://github.com/dsolisp/PlaywrightProject/actions/workflows/ci.yml/badge.svg)](https://github.com/dsolisp/PlaywrightProject/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, portfolio-quality test automation framework demonstrating industry best practices for 2026. Built with Playwright, Vitest, and TypeScript.

---

## 🏗️ Architecture (TL;DR)

- **Pages/Locators 1:1 separation**: Pure locator data files mirroring business-logic page objects.
- **Zero locators in specs**: Enforced by strict ESLint guardrails (`no-restricted-syntax`).
- **API seeding for parallel safety**: Playwright fixtures (`fixtures/`) for shared setup where tests need it.
- **Semantic Locators**: Accessibility-first selectors (`getByRole`, `getByPlaceholder`).
- → [View Full Architecture & ADRs](docs/ARCHITECTURE.md)
- → [Read the "Zero to Hero" Learning Journey](docs/ZERO_TO_HERO.md)

---

## 📊 Test suites (implementation)

- **Unit + database**: Vitest under `tests/unit/` and `tests/database/`
- **Playwright**: `tests/` (see `playwright.config.ts` `testDir` / `testIgnore`)
- **BDD**: `tests/bdd/` (separate config inside that folder)

Counts change as tests are added; discover locally with `pnpm run test:unit` and `pnpm exec playwright test --list`.

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

| Feature                 | Technology           | Description                                                                     |
| ----------------------- | -------------------- | ------------------------------------------------------------------------------- |
| **E2E Web Testing**     | Playwright           | Page Object Model with 1:1 locator pairing                                      |
| **API / schema checks** | Playwright Request   | REST checks + JSON shape tests (e.g. `tests/backend/schema-validation.spec.ts`) |
| **Visual Regression**   | Playwright Snapshots | Automated screenshot comparison                                                 |
| **Accessibility**       | axe-core             | WCAG 2.1 AA compliance checking                                                 |
| **BDD Testing**         | playwright-bdd       | Cucumber-style Gherkin syntax                                                   |
| **Unit Testing**        | Vitest               | Fast, modern unit test runner                                                   |
| **Performance**         | Playwright Metrics   | Page load and Core Web Vitals                                                   |

### 🏗️ Architecture Patterns

- **Page Object Model (POM)** - 1:1 Page + Locator file pairing
- **Fixture Pattern** - Reusable test setup with authentication
- **Factory Pattern** - Dynamic test data generation
- **Configuration Management** - Environment-based settings in `config/` (`constants.ts`, `settings.ts`)

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
├── tests/                        # Playwright specs (see playwright.config.ts testDir)
│   ├── auth/                     # Auth setup project (storage state)
│   ├── accessibility/            # A11y tests (axe)
│   ├── backend/                  # Backend/schema validation tests
│   ├── integration/              # End-to-end integration suites
│   ├── performance/              # Performance/metrics oriented suites
│   └── ui/                       # UI suites (sauce/practice/visual)
├── pages/                        # Page objects (behavior)
├── locators/                     # Locator mirrors (no selectors in specs)
├── fixtures/                     # Test fixtures (ADR-009)
├── config/                       # Central settings/constants
├── utils/                        # Shared helpers (logging, data, etc.)
├── docs/                         # Zero-to-Hero, Architecture, ADRs
└── playwright.config.ts          # Playwright config (Chromium-only by default)
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
pnpm exec playwright test tests/ui/sauce/

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
pnpm exec playwright test --grep @search       # Inventory / filter flows on SauceDemo (not external search engines)
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

## 🎯 Applications under test

### 1. SauceDemo (primary UI)

- **Default**: `https://www.saucedemo.com` (`URLS.SAUCE_DEMO` in `config/constants.ts`)
- **Tests**: `tests/ui/sauce/` (login, inventory, cart, checkout patterns)

### 2. Local practice app (UI drills)

- **Default**: `http://localhost:8080` (`URLS.PRACTICE_APP` — override with `PRACTICE_BASE_URL`)
- **Tests**: `tests/ui/practice/` (alerts, windows, iframes, selectors, etc.)

### 3. Public APIs (backend / schema)

- Examples: JSONPlaceholder, SWAPI (see `tests/backend/` and `config/constants.ts`)

---

## 📁 Key Files Explained

| File                         | Purpose                              |
| ---------------------------- | ------------------------------------ |
| `playwright.config.ts`       | Browser config, timeouts, reporters  |
| `vitest.config.ts`           | Unit test runner configuration       |
| `fixtures/test.fixture.ts`   | Custom Playwright fixtures with auth |
| `pages/base.page.ts`         | Base page pattern for page objects   |
| `config/settings.ts`         | Environment configuration loader     |
| `utils/test-data-factory.ts` | Factory helpers for test data        |

---

## 🔐 Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# URL configuration (see config/constants.ts)
# playwright.config.ts uses: process.env.BASE_URL || URLS.SAUCE_DEMO
BASE_URL=https://www.saucedemo.com               # Optional override (defaults to SauceDemo)
SAUCE_DEMO_URL=https://www.saucedemo.com         # E-commerce demo app
API_BASE_URL=https://jsonplaceholder.typicode.com # REST API for testing

# Database
DATABASE_PATH=./test-data/chinook.db             # SQLite database for tests

# Logging
LOG_LEVEL=info              # debug, info, warn, error
LOG_TO_FILE=true            # Set to 'false' to disable file logging
LOG_SILENT=false            # Set to 'true' to disable all logging

# Browser / runner
HEADLESS=true               # Set to 'false' for headed mode
# CI config defines chromium (+ setup) only; extra browsers require new projects in playwright.config.ts
```

### URL Configuration

All URLs are defined in `config/constants.ts` as the single source of truth (see that file for the full list).

| URL Constant            | Default                              | Environment Variable          | Purpose                |
| ----------------------- | ------------------------------------ | ----------------------------- | ---------------------- |
| `URLS.SAUCE_DEMO`       | https://www.saucedemo.com            | `BASE_URL` / `SAUCE_DEMO_URL` | Primary UI tests       |
| `URLS.JSON_PLACEHOLDER` | https://jsonplaceholder.typicode.com | `API_BASE_URL`                | API tests              |
| `URLS.SWAPI`            | https://swapi.dev/api                | -                             | Schema-style API tests |
| `URLS.REQRES`           | https://reqres.in/api                | -                             | Auth API (optional)    |

To change URLs for different environments, set the environment variables in `.env` or pass them at runtime.

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Run quality checks: `pnpm run lint && pnpm test`
3. Commit with conventional commits: `feat(scope): description`
4. Submit a PR to `main`

### Code Style

- Follow Page Object Model with 1:1 locator pairing
- Add new pages under `pages/<app>/` with matching locators under `locators/`
- Include unit tests for new utilities
- Update documentation for new features

---

## 🐛 Troubleshooting

| Issue                     | Solution                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser not installed     | `pnpm exec playwright install --with-deps chromium`                                                                                                             |
| Practice app not running  | Start the practice app on `PRACTICE_BASE_URL` (default `http://localhost:8080`) before `@practice` UI tests                                                     |
| Visual tests fail         | Run `pnpm run snapshots:update`                                                                                                                                 |
| TypeScript errors         | Run `pnpm run typecheck`                                                                                                                                        |
| ESLint errors             | Run `pnpm run lint` to see issues                                                                                                                               |
| Database tests skip       | Download Chinook DB: `curl -L -o test-data/chinook.db https://github.com/lerocha/chinook-database/raw/master/ChinookDatabase/DataSources/Chinook_Sqlite.sqlite` |
| better-sqlite3 build fail | Ensure you have C++ build tools: macOS: `xcode-select --install`, Linux: `apt install build-essential`                                                          |

---

## 📚 Documentation

- [docs/ZERO_TO_HERO.md](docs/ZERO_TO_HERO.md) - Complete guide to recreate this project from scratch (`docs/ZERO-TO-HERO.md` redirects here)

---

## 🏆 Why This Framework?

This project demonstrates:

✅ **Modern Architecture** - 1:1 POM + Locator pattern, fixtures, factories
✅ **Multi-Layer Testing** - Unit, integration, E2E, visual, accessibility, BDD
✅ **Type Safety** - Full TypeScript with strict mode
✅ **CI/CD Ready** - GitHub Actions with Allure reporting
✅ **Real-World Patterns** - Auth storage state, practice-app UI drills, data-driven tests
✅ **2025 Best Practices** - ESLint v9, Vitest, Playwright latest

---

## 📄 License

ISC

---

Built with ❤️ using Playwright, TypeScript, and modern testing practices
