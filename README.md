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

## More

- See `docs/` for feature guides and CI/CD details.
