# Architecture Decision Records (ADRs)

This document tracks the core architectural decisions of the framework, providing context for _why_ specific patterns were chosen.

---

## ADR-001: Flat Directory Structure

**Context:** Multi-level folder nesting (`src/e2e/specs/...`) slows down navigation and makes imports complex.
**Decision:** Adopt a horizontal, flat structure at the root level (`pages/`, `locators/`, `tests/`).
**Consequences:** Easier discoverability, simpler import paths (`../../pages/...`), and alignment with 2026 industry standards for clean test repos.

---

## ADR-002: Pages/Locators 1:1 Separation

**Context:** Combining locators and interactions in the same file leads to bloated, multi-responsibility Page Objects that are hard to maintain.
**Decision:** Separate pure locator data classes (`locators/`) from business logic interactions (`pages/`). Maintain a strict 1:1 mapping between them.
**Consequences:** Locators can be audited independently. Page Objects stay focused on actions and assertions. Prevents stale element exceptions by using `get` accessor methods.

---

## ADR-003: Zero Locators in Specs

**Context:** Mixing `page.locator()` or `getByRole` inside `.spec.ts` files violates the DRY principle and scatters UI definitions across tests.
**Decision:** Enforce a strict "Zero Locators in Specs" policy using ESLint (`no-restricted-syntax`).
**Consequences:** Forces developers to encapsulate UI changes in Page Objects. Specs remain readable, focused on intent, and resilient to UI changes.

---

## ADR-004: API Seeding for Parallel Safety

**Context:** Using UI steps for setup (e.g. logging in, adding items to cart) for every test is slow and increases flakiness.
**Decision:** Prioritize `APIRequestContext` for state setup and teardown. Mock real APIs if not available to establish the pattern.
**Consequences:** Setup drops from 2-3 seconds to ~50ms. Tests are naturally parallel-safe, independent, and highly performant.

---

## ADR-005: Semantic Locators

**Context:** Relying on structural selectors (XPath/CSS) makes tests fragile and disconnected from the user experience.
**Decision:** Prioritize Playwright's semantic locators:

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId` (as a fallback)
   **Consequences:** Tests verify accessibility and behave like real users. Selectors survive redesigns much better.
