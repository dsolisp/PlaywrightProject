# Playwright TypeScript Test Automation Framework

![CI](https://github.com/dsolisp/PlaywrightProject/actions/workflows/ci.yml/badge.svg)

A modern, portfolio-quality test automation framework demonstrating industry best practices for 2025. Built with Playwright, Vitest, and TypeScript.

---

## 📊 Test Coverage

| Test Type     | Count   | Framework      |
| ------------- | ------- | -------------- |
| Unit Tests    | 98      | Vitest         |
| E2E/Web Tests | 78      | Playwright     |
| BDD Tests     | 13      | playwright-bdd |
| **Total**     | **189** |                |

---

## 📋 Prerequisites

- **Node.js 20+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- (Optional) **Allure CLI** for local reporting: `brew install allure`

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/dsolisp/PlaywrightProject.git
cd PlaywrightProject

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npm test
```

---

## ✨ Key Features

### 🧪 Testing Capabilities

| Feature               | Technology           | Description                                   |
| --------------------- | -------------------- | --------------------------------------------- |
| **E2E Web Testing**   | Playwright           | Page Object Model with base class inheritance |
| **API Testing**       | Axios + Playwright   | REST API validation and contract testing      |
| **Visual Regression** | Playwright Snapshots | Automated screenshot comparison               |
| **Accessibility**     | axe-core             | WCAG 2.1 AA compliance checking               |
| **BDD Testing**       | playwright-bdd       | Cucumber-style Gherkin syntax                 |
| **Unit Testing**      | Vitest               | Fast, modern unit test runner                 |
| **Performance**       | Playwright Metrics   | Page load and Core Web Vitals                 |

### 🏗️ Architecture Patterns

- **Page Object Model (POM)** - Centralized page interactions
- **Fixture Pattern** - Reusable test setup with authentication
- **Factory Pattern** - Dynamic test data generation
- **Centralized Locators** - Single source of truth for selectors
- **Configuration Management** - Environment-based settings

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
├── src/                          # Source code
│   ├── config/                   # Configuration management
│   │   ├── constants.ts          # Application constants & credentials
│   │   └── settings.ts           # Environment settings loader
│   ├── fixtures/                 # Playwright test fixtures
│   │   └── test-fixtures.ts      # Custom fixtures with auth
│   ├── locators/                 # Centralized element selectors
│   │   ├── sauce-demo.locators.ts
│   │   └── search-engine.locators.ts
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          # Abstract base page
│   │   ├── sauce-demo/           # SauceDemo pages (split by page)
│   │   │   ├── index.ts          # Barrel exports
│   │   │   ├── login.page.ts     # Login page
│   │   │   ├── inventory.page.ts # Inventory page
│   │   │   ├── cart.page.ts      # Cart page
│   │   │   └── checkout.page.ts  # Checkout page
│   │   └── search-engine.page.ts # Bing search page object
│   └── utils/                    # Utility modules
│       ├── data-manager.ts       # Test data loading (CSV, JSON, YAML)
│       ├── database.ts           # SQLite database helper
│       ├── logger.ts             # Winston-based structured logging
│       └── test-data-factory.ts  # Factory pattern for test data
│
├── tests/                        # All test files
│   ├── accessibility/            # WCAG accessibility tests
│   ├── api/                      # API integration tests
│   ├── bdd/                      # Cucumber BDD tests
│   │   ├── features/             # Gherkin feature files
│   │   └── steps/                # Step definitions
│   ├── contract/                 # API contract tests
│   ├── database/                 # Database tests
│   ├── integration/              # E2E integration tests
│   ├── performance/              # Performance metrics tests
│   ├── unit/                     # Unit tests (Vitest)
│   ├── visual/                   # Visual regression tests
│   └── web/                      # Web E2E tests
│
├── test-data/                    # Test data files
│   ├── users.json                # User test data
│   └── test_users.csv            # CSV test data
│
├── .github/workflows/            # CI/CD pipelines
│   └── ci.yml                    # GitHub Actions workflow
│
├── playwright.config.ts          # Playwright configuration
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
npm test

# Unit tests only (Vitest)
npm run test:unit

# Playwright E2E tests
npx playwright test

# Specific test file
npx playwright test tests/web/sauce-demo.spec.ts

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Update visual snapshots
npm run playwright:update-snapshots

# Run by test tag
npx playwright test --grep @smoke        # Quick validation tests
npx playwright test --grep @regression   # Full regression suite
npx playwright test --grep @auth         # Authentication tests
npx playwright test --grep @cart         # Shopping cart tests
npx playwright test --grep @checkout     # Checkout flow tests
npx playwright test --grep @search       # Search engine tests
```

### BDD Tests (Separate Config)

```bash
cd tests/bdd
npx bddgen                        # Generate test files from features
npx playwright test               # Run BDD tests
```

### Test Reports

```bash
# View Playwright HTML report
npx playwright show-report

# Generate Allure report
npm run allure
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
| `src/fixtures/test-fixtures.ts`  | Custom Playwright fixtures with auth     |
| `src/pages/base.page.ts`         | Abstract base class for all pages        |
| `src/config/settings.ts`         | Environment configuration loader         |
| `src/utils/test-data-factory.ts` | Factory pattern for generating test data |

---

## 🔐 Environment Variables

Create a `.env` file (see `.env.example`):

```bash
# Optional - defaults are provided
BASE_URL=https://www.bing.com
SAUCE_DEMO_URL=https://www.saucedemo.com
LOG_LEVEL=info              # debug, info, warn, error
LOG_TO_FILE=true            # Set to 'false' to disable file logging
LOG_SILENT=false            # Set to 'true' to disable all logging
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Run quality checks: `npm run lint && npm test`
3. Commit with conventional commits: `feat(scope): description`
4. Submit a PR to `main`

### Code Style

- Follow Page Object Model for new pages
- Add locators to centralized locator files
- Include unit tests for new utilities
- Update documentation for new features

---

## 🐛 Troubleshooting

| Issue                 | Solution                                             |
| --------------------- | ---------------------------------------------------- |
| Browser not installed | `npx playwright install --with-deps`                 |
| Tests timeout on Bing | Normal - CAPTCHA protection, tests handle gracefully |
| Visual tests fail     | Run `npm run playwright:update-snapshots`            |
| TypeScript errors     | Run `npx tsc --noEmit` to check                      |
| ESLint errors         | Run `npm run lint` to see issues                     |

---

## 📚 Documentation

- [ZERO-TO-HERO.md](ZERO-TO-HERO.md) - Complete guide to recreate this project from scratch
- [.github/prompts/playwright.prompt.md](.github/prompts/playwright.prompt.md) - AI prompt used to generate this project

---

## 🏆 Why This Framework?

This project demonstrates:

✅ **Modern Architecture** - POM, fixtures, factories, centralized config
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
