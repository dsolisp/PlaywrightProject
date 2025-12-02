---
mode: agent
---

# Portfolio JS/TS Test Automation Repo

> **Note**: This prompt was used to generate the initial project. The actual implementation has evolved - see README.md for current state.

## Objective

Generate a modern, portfolio-quality JavaScript/TypeScript test automation repository that demonstrates advanced automation capabilities with industry best practices for 2025.

## Implemented Tech Stack

| Category       | Technology                    | Status |
| -------------- | ----------------------------- | ------ |
| Test Runner    | Playwright Test (TypeScript)  | ✅     |
| Unit Testing   | Vitest (replaced Jest)        | ✅     |
| API Testing    | Axios + Playwright            | ✅     |
| DB Testing     | better-sqlite3                | ✅     |
| Visual Testing | Playwright built-in snapshots | ✅     |
| Accessibility  | axe-core                      | ✅     |
| BDD            | playwright-bdd                | ✅     |
| Reporting      | Allure                        | ✅     |
| Logging        | Pino + Winston                | ✅     |
| Linting        | ESLint v9 (flat config)       | ✅     |
| Formatting     | Prettier                      | ✅     |
| Pre-commit     | Husky + lint-staged           | ✅     |
| CI/CD          | GitHub Actions                | ✅     |

## Test Count

- **Unit Tests**: 98 (Vitest)
- **Playwright Tests**: 78
- **BDD Tests**: 13
- **Total**: 189 tests

## Actual Project Structure

```
PlaywrightProject/
├── src/
│   ├── config/          # Configuration (settings.ts, constants.ts)
│   ├── fixtures/        # Custom Playwright fixtures
│   ├── locators/        # Centralized selectors
│   ├── pages/           # Page Object Model (base.page.ts, etc.)
│   └── utils/           # Utilities (logger, data-manager, factory)
├── tests/
│   ├── accessibility/   # axe-core WCAG tests
│   ├── api/             # API integration tests
│   ├── bdd/             # Cucumber/Gherkin tests
│   ├── contract/        # API contract tests
│   ├── database/        # SQLite tests
│   ├── integration/     # E2E integration tests
│   ├── performance/     # Performance metrics
│   ├── unit/            # Unit tests (Vitest)
│   ├── visual/          # Visual regression
│   └── web/             # Browser E2E tests
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.js     # ESLint v9 flat config
└── package.json
```

## Test Applications

1. **SauceDemo** (https://www.saucedemo.com) - E-commerce demo
2. **Bing** (https://www.bing.com) - Search engine (CAPTCHA-resilient tests)

## Original Prompt Goals (for reference)

Visual: Search Engine homepage visual regression (pixelmatch)
Performance: Search Engine search with k6 (JS script)
Unit: All new functions/utilities must have Jest unit tests 4. Documentation
README.md with:
Project overview
Tech stack
Setup instructions
Example usage
Project structure tree
How to run tests (all types)
How to view Allure reports
How to run k6 scripts
How to use Husky/pre-commit
docs with:
Feature guides (E2E, API, DB, Visual, Perf)
CI/CD and contribution guide 5. Git & Commit Strategy
Never commit to main
Use feature branches for each logical unit (e.g., feature/e2e-search-engine, feature/api-search-engine, etc.)
Each commit must be atomic and leave the repo in a working state (tests pass, lint clean)
Each new function or utility must include a unit test in the same commit
Use conventional commit messages (e.g., feat(e2e): add search engine test)
CI must enforce lint, typecheck, and all tests on PRs 6. Acceptance Criteria
All representative files and tests are present and working
Allure and k6 integration is functional
Husky/pre-commit is set up and working
README and docs are clear and complete
CI workflow is present and passes
All code is idiomatic, typed, and follows best practices
Start by scaffolding the repo, then add features in atomic, working commits as described.

### 1. Initial Setup (main branch)

**a.** Create a `.gitignore` file **before** any code or dependency installation. It must include at least:

```
node_modules/
dist/
allure-results/
allure-report/
coverage/
.env
.DS_Store
*.log
*.sqlite
*.db
output/
tmp/
*.png
*.mp4
*.webm
```

Commit: `chore: add .gitignore to exclude node_modules and non-essential dirs`

**b.** Initialize the repo and install dependencies:

- Playwright Test (TypeScript)
- Axios
- better-sqlite3
- pixelmatch
- k6
- Allure
- pino
- Jest
- ESLint, Prettier
- Husky, lint-staged

**c.** Scaffold config files:

- `package.json` (with scripts for all test types, lint, format, prepare, Allure, k6)
- `tsconfig.json`
- `playwright.config.ts`
- `.eslintrc.js`
- `.prettierrc`
- `.husky/pre-commit`
- `.github/workflows/ci.yml`
- `README.md` (with project overview, setup, usage, structure, and test instructions)

**d.** Ensure `npm run lint`, `npm test`, and `npx playwright test` all pass before first commit of code/config files.

### 2. Feature Branches: Add Features Step-by-Step

#### 2.1. E2E: Search Engine (DuckDuckGo Example)

- Create `src/pages/search_engine_page.ts` (generic, parameterized page object)
- Create `src/locators/search_engine_locators.ts` (centralized locators, with DuckDuckGo as one option)
- Create `src/tests/e2e/search_engine.e2e.spec.ts` (E2E test for DuckDuckGo, using the generic page object)
- Ensure Playwright E2E test passes locally and in CI
- Commit: `feat(e2e): add generic search engine page and DuckDuckGo E2E test`

#### 2.2. API: DuckDuckGo Instant Answer

- Create `src/api/search_engine_api.ts` (typed API helper, with support for DuckDuckGo)
- Create `src/tests/api/search_engine_api.spec.ts` (Jest test for DuckDuckGo API)
- Ensure API test passes locally and in CI
- Commit: `feat(api): add generic search engine API helper and DuckDuckGo API test`

#### 2.3. DB: Chinook Sample

- Add Chinook DB to `src/db/chinook.db`
- Create `src/db/chinook_db.ts` (DB helper)
- Create `src/tests/db/chinook_db.spec.ts` (Jest test)
- Ensure DB test passes locally and in CI
- Commit: `feat(db): add Chinook DB queries`

#### 2.4. Visual Regression: Search Engine (DuckDuckGo Example)

- Create `src/tests/visual/search_engine.visual.spec.ts` (Playwright + pixelmatch, using the generic page object and locators for DuckDuckGo)
- Add baseline image to repo
- Ensure visual test passes locally and in CI
- Commit: `feat(visual): add generic search engine visual regression test (DuckDuckGo)`

#### 2.5. Performance: Search Engine (DuckDuckGo Example) with k6

- Create `k6/search_engine.k6.js` (k6 script for DuckDuckGo)
- Add test runner script to `package.json`
- Ensure k6 script runs and passes locally and in CI
- Commit: `feat(perf): add generic search engine k6 performance test (DuckDuckGo)`

#### 2.6. Utilities: Logger

- Create `src/utils/logger.ts` (pino logger)
- Create `src/tests/unit/logger.spec.ts` (Jest unit test)
- Ensure unit test passes locally and in CI
- Commit: `feat(utils): add pino logger with unit test`

---

- Use a generic, parameterized page object and centralized locators for all search engines, including DuckDuckGo.
- Do not create DuckDuckGo-specific page classes or files.
- All tests and helpers should be generic, with configuration/locators for DuckDuckGo as needed.
