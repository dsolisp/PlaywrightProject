/**
 * dependency-cruiser config — Gold Standard layer guard.
 * Enforces: tests > pages|components > locators
 * Run via: pnpm depcruise
 *
 * ADR-012 (Tooling): dependency-cruiser for TypeScript layer isolation.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // ── Law 1 / Layering: locators must not import from pages or components ──
    {
      name: 'no-locators-importing-pages',
      severity: 'error',
      comment: 'Locators are pure selector definitions — they must not depend on pages or components.',
      from: { path: '^locators/' },
      to: { path: '^(pages|components)/' },
    },

    // ── Law 4 / Layering: components must not import from pages ──────────────
    {
      name: 'no-components-importing-pages',
      severity: 'error',
      comment: 'Components are composed into pages, not the other way around.',
      from: { path: '^components/' },
      to: { path: '^pages/' },
    },

    // ── Law 3 / Layering: pages must not import from tests ───────────────────
    {
      name: 'no-pages-importing-tests',
      severity: 'error',
      comment: 'Page objects must not depend on test files.',
      from: { path: '^pages/' },
      to: { path: '^tests/' },
    },

    // ── Law 3: locators must not import from tests ───────────────────────────
    {
      name: 'no-locators-importing-tests',
      severity: 'error',
      comment: 'Locators must not depend on test files.',
      from: { path: '^locators/' },
      to: { path: '^tests/' },
    },

    // ── Circular dependencies are always forbidden ───────────────────────────
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular imports create unpredictable test behaviour.',
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
