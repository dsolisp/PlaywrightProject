# Playwright TypeScript Test Framework

A production-ready test automation framework built with **Playwright** and **TypeScript**, featuring complete feature parity with the Python Selenium and Java Selenium projects in this repository.

## ✨ Features

| Category         | Features                                                                               |
| ---------------- | -------------------------------------------------------------------------------------- |
| **Test Types**   | Unit, API, Web UI, Visual, Accessibility, Performance, Contract, Database, Integration |
| **Browsers**     | Chromium, Firefox, WebKit (Safari)                                                     |
| **Reporting**    | HTML, Allure, JSON, JUnit XML                                                          |
| **CI/CD**        | GitHub Actions, Docker, Docker Compose                                                 |
| **Code Quality** | TypeScript, ESLint, Prettier                                                           |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run unit tests
npm run test:unit

# Run API tests
npm run test:api

# Run web tests
npm run test:web

# Run all tests
npm test
```

## 📁 Project Structure

```
PlaywrightProject/
├── src/
│   ├── config/          # Settings, constants, timeouts
│   ├── fixtures/        # Playwright fixtures (pages, auth)
│   ├── locators/        # Centralized element locators
│   ├── pages/           # Page Object Models
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Logger, data manager, error classifier
├── tests/
│   ├── api/             # API tests (REST)
│   ├── web/             # Web UI tests
│   ├── unit/            # Unit tests (Vitest)
│   ├── visual/          # Visual regression tests
│   ├── accessibility/   # A11y tests (Axe-core)
│   ├── performance/     # Performance tests
│   ├── contract/        # API contract tests
│   ├── database/        # Database tests (SQLite)
│   └── integration/     # E2E integration tests
├── scripts/             # Shell scripts
├── test-data/           # Test data files
├── Dockerfile           # Docker image
├── docker-compose.yml   # Docker Compose config
└── playwright.config.ts # Playwright configuration
```

## 🧪 Test Commands

```bash
# Unit tests with coverage
npm run test:unit
npm run coverage

# Playwright tests
npm run test:api          # API tests
npm run test:web          # Web tests
npm run test:a11y         # Accessibility tests
npm run test:visual       # Visual tests
npm run test:performance  # Performance tests
npm run test:contract     # Contract tests

# All tests
npm test

# Headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug

# View HTML report
npx playwright show-report
```

## 🐳 Docker

```bash
# Run all tests in Docker
docker-compose up playwright

# Run specific test type
docker-compose up unit-tests
docker-compose up api-tests
docker-compose up web-tests

# View Allure reports
docker-compose up -d allure
open http://localhost:5050
```

## 📊 Feature Parity Matrix

| Feature                | Python Selenium   | Java Selenium       | TypeScript Playwright   |
| ---------------------- | ----------------- | ------------------- | ----------------------- |
| **Core Architecture**  |
| Page Object Model      | ✅ `BasePage`     | ✅ `BasePage`       | ✅ `BasePage`           |
| Centralized Locators   | ✅ `locators/`    | ✅ `locators/`      | ✅ `src/locators/`      |
| Settings/Config        | ✅ `settings.py`  | ✅ `Settings.java`  | ✅ `settings.ts`        |
| Constants              | ✅ `constants.py` | ✅ `Constants.java` | ✅ `constants.ts`       |
| **Test Types**         |
| Unit Tests             | ✅ pytest (205)   | ✅ JUnit (117)      | ✅ Vitest (52)          |
| API Tests              | ✅ requests       | ✅ RestAssured      | ✅ Playwright request   |
| Web UI Tests           | ✅ Selenium       | ✅ Selenium         | ✅ Playwright           |
| Visual Regression      | ✅ pixelmatch     | ✅ ImageIO          | ✅ `toHaveScreenshot()` |
| Accessibility          | ✅ axe-core       | ✅ axe-core         | ✅ @axe-core/playwright |
| Performance            | ✅ Locust         | ✅ Gatling          | ✅ Core Web Vitals      |
| Contract Tests         | ✅ -              | ✅ Pact             | ✅ Schema validation    |
| Database Tests         | ✅ SQLite         | ✅ SQLite           | ✅ better-sqlite3       |
| **Utilities**          |
| Error Classifier       | ✅                | ✅                  | ✅                      |
| Structured Logging     | ✅                | ✅                  | ✅ Winston              |
| Test Data Manager      | ✅                | ✅                  | ✅                      |
| Performance Monitor    | ✅                | ✅                  | ✅                      |
| **Infrastructure**     |
| Docker Support         | ✅                | ✅                  | ✅                      |
| CI/CD (GitHub Actions) | ✅                | ✅                  | ✅                      |
| Allure Reports         | ✅                | ✅                  | ✅                      |
| HTML Reports           | ✅ pytest-html    | ✅ Extent           | ✅ Playwright HTML      |
| Parallel Execution     | ✅ pytest-xdist   | ✅ JUnit parallel   | ✅ Built-in             |

### Test Counts Summary

| Framework      | Unit | API | Web | Visual | A11y | Perf | Contract | Integration | **Total** |
| -------------- | ---- | --- | --- | ------ | ---- | ---- | -------- | ----------- | --------- |
| **Python**     | 205  | 16  | ~20 | 4      | -    | 8    | -        | 15          | **~268**  |
| **Java**       | 117  | 16  | -   | -      | 4    | -    | 3        | -           | **~140**  |
| **TypeScript** | 52   | 11  | 16  | 10     | 6    | 8    | 7        | 5           | **115**   |

## 🔧 Configuration

### Environment Variables

```bash
BASE_URL=https://duckduckgo.com
API_BASE_URL=https://jsonplaceholder.typicode.com
HEADLESS=true
BROWSER=chromium
CI=true
```

### playwright.config.ts

Key configuration options:

- Multi-browser support (Chromium, Firefox, WebKit)
- Automatic retries on failure
- Video and trace on retry
- HTML and Allure reporting

## 📝 Writing Tests

### Page Object Example

```typescript
import { BasePage } from './base.page';
import { LoginLocators } from '../locators/sauce-demo.locators';

export class LoginPage extends BasePage {
  async login(username: string, password: string): Promise<void> {
    await this.fill(LoginLocators.USERNAME_INPUT, username);
    await this.fill(LoginLocators.PASSWORD_INPUT, password);
    await this.click(LoginLocators.LOGIN_BUTTON);
  }
}
```

### Test Example

```typescript
import { test, expect } from '../fixtures/test-fixtures';

test('should login successfully', async ({ loginPage, inventoryPage }) => {
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  expect(await inventoryPage.isLoaded()).toBe(true);
});
```

## 📈 Reports

- **HTML Report**: `npx playwright show-report`
- **Allure Report**: `npm run report`
- **Coverage**: `open coverage/index.html`

## 🛠️ Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

## 📚 Related Projects

- [Python Selenium Framework](../) - Python version with pytest
- [Java Selenium Framework](../SeleniumJavaProject/) - Java version with JUnit

---

Built with ❤️ using Playwright + TypeScript
