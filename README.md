# Playwright TypeScript Test Automation Framework

Enterprise-grade, modern test automation with Playwright, Jest, k6, and Allure reporting. Inspired by best practices from PythonSeleniumProject.

---

## 📋 Prerequisites

- Node.js 20+
- npm (comes with Node.js)
- Git
- Modern browsers (Chromium, Firefox, WebKit)
- [k6](https://k6.io/) for performance testing (`brew install k6` or see docs)
- (Optional) Allure CLI for local reporting: `brew install allure`

---

## ⚡ Quick Start

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests (unit, API, DB, visual, E2E, perf)
npm test
```

---

## ✨ Key Features

### 🧪 Testing Capabilities

- **E2E Automation**: Playwright with Page Object Model
- **API Testing**: Typed Axios client + Jest
- **Visual Regression**: Playwright snapshot testing (Pixelmatch)
- **Database Testing**: SQLite (Chinook DB) with typed helpers
- **Performance Testing**: k6 integration with programmatic assertions
- **Logging**: Pino-based logger utility
- **CI/CD**: GitHub Actions with Allure and k6 artifact upload

### 📊 Analytics & Reporting

- **Allure Reports**: Rich HTML reporting for E2E and API tests
- **k6 Results**: JSON summary and CI artifact upload

### 🔧 Enterprise Features

- **Pre-commit hooks**: Husky + lint-staged for code quality
- **Type Safety**: TypeScript throughout
- **Parallel Execution**: Playwright and Jest run in parallel by default
- **Code Quality**: ESLint, Prettier, type-checking

---

## 🏗️ Project Structure

```
PlaywrightProject/
├── src/
│   ├── api/                # API client helpers
│   ├── db/                 # DB helpers & Chinook DB
│   ├── locators/           # Centralized selectors
│   ├── pages/              # Page Object Model
│   └── tests/              # All test types
│       ├── api/            # API tests
│       ├── db/             # DB tests
│       ├── e2e/            # E2E Playwright tests
│       ├── perf/           # k6 integration tests
│       ├── unit/           # Unit tests
│       └── visual/         # Visual regression tests
├── k6/                     # k6 scripts
├── scripts/                # Node helpers (k6 runner, etc)
├── docs/                   # Feature guides (see k6-performance.md)
├── .github/workflows/      # CI/CD configs
├── package.json            # npm scripts & dependencies
├── playwright.config.ts    # Playwright config
├── jest.config.cjs         # Jest config
├── k6-config.json          # Perf thresholds
└── ...
```

---

## 🧪 Running Tests

### Unified Workflow

```bash
npm test                # All tests (unit, API, DB, visual, E2E, perf)
npx playwright test     # E2E/visual only
npm run test:unit       # Unit tests
npm run test:api        # API tests
npm run test:db         # DB tests
npm run test:visual     # Visual regression
npm run k6:run:short    # Perf (smoke)
npm run k6:run          # Perf (full)
```

### CI/CD

- See `.github/workflows/ci.yml` for full pipeline (lint, typecheck, all tests, Allure, k6, artifact upload)

---

## 📊 Reporting

### Allure

- Run: `npm run allure` (after tests)
- View: `allure open allure-report`
- CI: Allure results uploaded as artifacts

### k6 Performance

- See `docs/k6-performance.md` for details
- Thresholds in `k6-config.json`
- Results uploaded in CI

---

## 📚 Documentation

- [Performance Testing Guide](docs/k6-performance.md)
- (Add more guides in `docs/` as needed)

---

## 🤝 Contributing

1. Fork the repository
2. Run `npm run lint` and `npm test` before committing
3. Use feature branches and submit PRs to `main`
4. Follow the Page Object Model and test structure
5. Update docs if adding new features

---

## 💡 Best Practices

- Use npm scripts for all test types
- Keep selectors centralized
- Use fixtures for stable E2E/visual tests in CI
- Review Allure and k6 reports after CI runs
- Keep dependencies up to date

---

## 🐛 Troubleshooting

- **Playwright browser install**: `npx playwright install --with-deps`
- **k6 not found**: Install with `brew install k6` or see [k6 docs](https://k6.io/docs/)
- **Allure CLI**: Install with `brew install allure`
- **DB errors**: Ensure `src/db/chinook.db` exists and is a valid SQLite DB
- **Test failures**: Check logs in `logs/` and CI artifacts

---

## 🏆 Framework Stats

- ✅ All major test types: E2E, API, DB, Visual, Perf
- ✅ Allure and k6 reporting in CI
- ✅ 90%+ code coverage (see coverage/)
- ✅ Modern TypeScript, Playwright, Jest, k6

---

Ready to automate your testing? Start with `npm test` 🚀
