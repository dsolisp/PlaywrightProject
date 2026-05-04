import type { Page } from '@playwright/test';

export class LoginLocators {
  constructor(private readonly page: Page) {}

  get usernameInput() { return this.page.getByPlaceholder('Username'); }
  get passwordInput() { return this.page.getByPlaceholder('Password'); }
  get loginButton() { return this.page.getByRole('button', { name: 'Login' }); }
  get errorMessage() { return this.page.getByTestId('error'); }
  get loginWrapper() { return this.page.locator('.login_wrapper'); }
  get loginLogo() { return this.page.locator('.login_logo'); }
}
