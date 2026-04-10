import { Page, Locator, expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';
import { UserCredentials } from '../../../lib/utils/test-data-factory';

/**
 * Login Page Object - GEMINI Style
 * Uses semantic locators (getByRole, getByPlaceholder, getByTestId)
 * No separate locator file needed - locators are inline and self-documenting
 */
export class LoginPage {
  readonly page: Page;

  // Semantic locators - defined once, reused throughout
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use getByPlaceholder for inputs (most semantic for this UI)
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');

    // Use getByRole for buttons (accessibility-first)
    this.loginButton = page.getByRole('button', { name: 'Login' });

    // Use getByTestId for error (no better semantic option)
    this.errorMessage = page.getByTestId('error');
  }

  // ── Navigation ─────────────────────────────────────────────────────

  async open(): Promise<this> {
    await this.page.goto(settings().sauceDemoUrl);
    return this;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginWithUser(user: UserCredentials): Promise<void> {
    await this.login(user.username, user.password);
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(settings().sauceUsername, settings().saucePassword);
  }

  // ── Assertions (using expect with auto-retry) ──────────────────────

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  // ── Getters (when you need raw values) ─────────────────────────────

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
