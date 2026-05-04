import type { Page } from '@playwright/test';

/**
 * BaseComponent — shared driver reference for all UI components.
 * Components are COMPOSED into pages, never inherited (ADR-005, Law 4).
 * Contains zero assertions — components return values; tests assert (Law 2).
 */
export abstract class BaseComponent {
  constructor(readonly page: Page) {}
}
