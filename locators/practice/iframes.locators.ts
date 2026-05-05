import type { Page } from '@playwright/test';

/**
 * IframesLocators — locators for /iframes.html (ADV-E3, ADV-E4).
 * Pure locator definitions — zero logic, zero assertions (Law 1 & Law 2).
 *
 * Note: iframe *contents* are accessed via page.frameLocator() in the page object.
 * These locators target the host-page iframe *elements* and inner-document elements.
 */
export class IframesLocators {
  constructor(private readonly page: Page) {}

  // ── /iframes.html host-page elements ──────────────────────────────────
  get parentFrame() {
    return this.page.getByTestId('parent-frame');
  }
  get outerFrame() {
    return this.page.getByTestId('outer-frame');
  }

  // ── Inside parentFrame (editor.html) ──────────────────────────────────
  /** FrameLocator for the simple editor iframe. */
  get editorFrame() {
    return this.page.frameLocator('[data-test="parent-frame"]');
  }
  get editor() {
    return this.editorFrame.getByTestId('editor');
  }

  // ── Inside outerFrame → childFrame (inner-form.html) ──────────────────
  /** FrameLocator for the outer iframe. */
  get outerFrameLocator() {
    return this.page.frameLocator('[data-test="outer-frame"]');
  }
  get childFrameLocator() {
    return this.outerFrameLocator.frameLocator('[data-test="child-frame"]');
  }
  get innerName() {
    return this.childFrameLocator.getByTestId('inner-name');
  }
  get innerEmail() {
    return this.childFrameLocator.getByTestId('inner-email');
  }
  get innerSubmit() {
    return this.childFrameLocator.getByTestId('inner-submit');
  }
  get innerResult() {
    return this.childFrameLocator.getByTestId('inner-result');
  }
}
