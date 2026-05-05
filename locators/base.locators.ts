import type { Page } from '@playwright/test';

/**
 * BaseLocators — mirrors pages/base.page.ts (Law 1).
 * Base layer has no screen-specific selectors; concrete pages use feature locators.
 */
export class BaseLocators {
  constructor(private readonly _page: Page) {}
}
