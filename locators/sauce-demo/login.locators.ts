import type { Locator, Page } from '@playwright/test';
import { resolveHealingLocator } from '../../utils/healing-locator';

export class LoginLocators {
  constructor(private readonly page: Page) {}

  private async usernameResolved(): Promise<Locator> {
    const primary = this.page.getByPlaceholder('Username');
    return resolveHealingLocator(this.page, 'sauce.login.username', primary, [
      { name: 'placeholder-username', build: (p) => p.getByPlaceholder('Username') },
      { name: 'role-textbox', build: (p) => p.getByRole('textbox').first() },
      { name: 'css-input', build: (p) => p.locator('input[data-test="username"]') },
    ]);
  }

  private async loginButtonResolved(): Promise<Locator> {
    const primary = this.page.getByRole('button', { name: 'Login' });
    return resolveHealingLocator(this.page, 'sauce.login.submit', primary, [
      { name: 'role-login', build: (p) => p.getByRole('button', { name: 'Login' }) },
      { name: 'css-submit', build: (p) => p.locator('input[data-test="login-button"]') },
    ]);
  }

  get passwordInput() {
    return this.page.getByPlaceholder('Password');
  }

  get usernameInput() {
    return this.page.getByPlaceholder('Username');
  }

  /** Healing-enabled username (use in pages when AI_HEALING_ENABLED=true). */
  async usernameInputHealing(): Promise<Locator> {
    return this.usernameResolved();
  }

  /** Healing-enabled login button. */
  async loginButtonHealing(): Promise<Locator> {
    return this.loginButtonResolved();
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorMessage() {
    return this.page.getByTestId('error');
  }

  get loginWrapper() {
    return this.page.locator('.login_wrapper');
  }

  get loginLogo() {
    return this.page.locator('.login_logo');
  }
}
