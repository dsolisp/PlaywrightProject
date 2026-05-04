import type { Page } from '@playwright/test';

export class CheckoutLocators {
  constructor(private readonly page: Page) {}

  get firstNameInput() {
    return this.page.getByPlaceholder('First Name');
  }
  get lastNameInput() {
    return this.page.getByPlaceholder('Last Name');
  }
  get postalCodeInput() {
    return this.page.getByPlaceholder('Zip/Postal Code');
  }
  get continueButton() {
    return this.page.getByRole('button', { name: 'Continue' });
  }
  get finishButton() {
    return this.page.getByRole('button', { name: 'Finish' });
  }
  get totalLabel() {
    return this.page.locator('.summary_total_label');
  }
  get completeHeader() {
    return this.page.locator('.complete-header');
  }
}
