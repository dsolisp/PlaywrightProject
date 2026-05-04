import type { Page } from '@playwright/test';
import { settings } from '../../config/settings';
import type { UserCredentials } from '../../utils/test-data-factory';
import { LoginLocators } from '../../locators/sauce-demo/login.locators';
import { BasePage } from '../base.page';

/**
 * LoginPage — Gold Standard.
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * Returns values; let tests assert.
 */
export class LoginPage extends BasePage {
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  // ── Navigation ─────────────────────────────────────────────────────

  async open(): Promise<this> {
    await this.page.goto(settings().sauceDemoUrl, { waitUntil: 'domcontentloaded' });
    return this;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<void> {
    await this.locators.usernameInput.fill(username);
    await this.locators.passwordInput.fill(password);
    await this.locators.loginButton.click();
  }

  async loginWithUser(user: UserCredentials): Promise<void> {
    await this.login(user.username, user.password);
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(settings().sauceUsername, settings().saucePassword);
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    return (await this.locators.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.locators.errorMessage.isVisible();
  }

  errorMessageLocator() {
    return this.locators.errorMessage;
  }

  loginButtonLocator() {
    return this.locators.loginButton;
  }

  loginWrapperLocator() {
    return this.locators.loginWrapper;
  }

  loginLogoLocator() {
    return this.locators.loginLogo;
  }

  usernameInputLocator() {
    return this.locators.usernameInput;
  }
}
