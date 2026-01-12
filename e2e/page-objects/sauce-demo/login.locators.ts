/**
 * Login Page Locators
 * Brother file to login.page.ts - follows 1:1 Page Object + Locator pattern
 */
export const LoginLocators = {
  // Form elements
  USERNAME_INPUT: '[data-test="username"]',
  PASSWORD_INPUT: '[data-test="password"]',
  LOGIN_BUTTON: '[data-test="login-button"]',

  // Error handling
  ERROR_MESSAGE: '[data-test="error"]',
  ERROR_BUTTON: '.error-button',

  // Page elements
  LOGO: '.login_logo',
  BOT_IMAGE: '.bot_column',
} as const;
