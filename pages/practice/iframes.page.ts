import type { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { IframesLocators } from '../../locators/practice/iframes.locators';
import { URLS } from '../../config/constants';

/**
 * IframesPage — Gold Standard POM for /iframes.html (ADV-E3, ADV-E4).
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * All selectors live in IframesLocators (Law 1).
 *
 * Playwright treats same-origin iframes via frameLocator() — no plugin needed.
 */
export class IframesPage extends BasePage {
  private readonly locators: IframesLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new IframesLocators(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async open(): Promise<this> {
    await this.page.goto(`${URLS.PRACTICE_APP}/iframes.html`);
    return this;
  }

  // ── ADV-E3: Simple iframe (contenteditable editor) ────────────────────

  parentFrame() {
    return this.locators.parentFrame;
  }
  editor() {
    return this.locators.editor;
  }

  /** Type text into the rich-text editor inside the parent frame. */
  async typeInEditor(text: string): Promise<void> {
    await this.locators.editor.click();
    await this.locators.editor.fill(text);
  }

  // ── ADV-E4: Nested iframes ─────────────────────────────────────────────

  outerFrame() {
    return this.locators.outerFrame;
  }
  innerResult() {
    return this.locators.innerResult;
  }

  /** Submit the inner form inside the nested iframes. */
  async submitInnerForm(name: string, email: string): Promise<void> {
    await this.locators.innerName.fill(name);
    await this.locators.innerEmail.fill(email);
    await this.locators.innerSubmit.click();
  }
}
