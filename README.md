# PlaywrightProject

A modern, portfolio-quality JavaScript/TypeScript test automation repository demonstrating advanced automation capabilities with Playwright, API, DB, visual, and performance testing.

## Tech Stack

- Playwright Test (TypeScript)
- Axios (API testing)
- better-sqlite3 (DB testing)
- pixelmatch (visual regression)
- k6 (performance)
- Allure (reporting)
- pino (logging)
- Jest (unit testing)
- ESLint, Prettier (linting/formatting)
- Husky, lint-staged (pre-commit)

## Project Structure

```
.
├── README.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── ...
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── src/
│   ├── pages/
│   ├── api/
│   ├── db/
│   ├── utils/
│   └── tests/
├── allure-results/
├── k6/
├── .husky/
├── .eslintrc.js
├── .prettierrc
└── ...
```

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

## Usage

- **Lint:** `npm run lint`
- **Format:** `npm run format`
- **Test (all):** `npm test`
- **E2E:** `npx playwright test`
- **Unit:** `npm run test:unit`
- **API:** `npm run test:api`
- **DB:** `npm run test:db`
- **Visual:** `npm run test:visual`
- **Performance:** `npm run k6`
- **Allure Report:** `npm run allure`

## Contributing

- Use feature branches for each logical unit
- Each commit must be atomic and leave the repo in a working state
- Use conventional commit messages
- CI enforces lint, typecheck, and all tests on PRs

## Visual tests and fixtures

- The E2E and visual suites default to using a local HTML fixture for DuckDuckGo in CI to avoid flakiness from bot-detection and dynamic content.
- Local runs will attempt a live search first and automatically fall back to the fixture if the live site blocks the headless request.

Opt-in to live site testing

- To force tests to use the real DuckDuckGo site (dev-only), set an environment variable when running tests:

```bash
USE_LIVE=true npx playwright test
```

Updating visual baselines

- The visual test creates a baseline image on first run at `src/tests/visual/duckduckgo_baseline.png`.
- To regenerate and commit a new baseline locally:

```bash
# run the visual test to recreate the baseline
rm -f src/tests/visual/duckduckgo_baseline.png && npm run test:visual
# review the new baseline, then commit it
git add src/tests/visual/duckduckgo_baseline.png && git commit -m "test(visual): update baseline"
```

CI notes

- CI uses the fixture baseline checked into the repository for deterministic comparisons. If you prefer to keep baselines out of source control, we can switch to storing them as CI artifacts and update the workflow accordingly.

## More

- See `docs/` for feature guides and CI/CD details.
