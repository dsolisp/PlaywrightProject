import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { LoginLocators } from './login.locators';
import { settings } from '../../../lib/config/settings';
import { UserCredentials } from '../../../lib/utils/test-data-factory';

/**
 * Login Page Object
 * Handles authentication flows for SauceDemo
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    await this.navigateTo(settings().sauceDemoUrl);
    return this;
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(LoginLocators.USERNAME_INPUT, username);
    await this.fill(LoginLocators.PASSWORD_INPUT, password);
    await this.click(LoginLocators.LOGIN_BUTTON);
  }

  async loginWithUser(user: UserCredentials): Promise<void> {
    await this.login(user.username, user.password);
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(settings().sauceUsername, settings().saucePassword);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(LoginLocators.ERROR_MESSAGE);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(LoginLocators.ERROR_MESSAGE);
  }
}
