import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { CheckoutLocators } from './checkout.locators';
import { CheckoutInfo } from '../../../lib/utils/test-data-factory';

/**
 * Checkout Page Object
 * Handles the 3-step checkout flow: Info → Overview → Complete
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(CheckoutLocators.FIRST_NAME, firstName);
    await this.fill(CheckoutLocators.LAST_NAME, lastName);
    await this.fill(CheckoutLocators.POSTAL_CODE, postalCode);
  }

  async fillWithInfo(info: CheckoutInfo): Promise<void> {
    await this.fillInformation(info.firstName, info.lastName, info.zipCode);
  }

  async continue(): Promise<void> {
    await this.click(CheckoutLocators.CONTINUE_BUTTON);
  }

  async finish(): Promise<void> {
    await this.click(CheckoutLocators.FINISH_BUTTON);
  }

  async getTotal(): Promise<string> {
    return this.getText(CheckoutLocators.TOTAL);
  }

  async isComplete(): Promise<boolean> {
    return this.isVisible(CheckoutLocators.COMPLETE_HEADER);
  }

  async getCompleteMessage(): Promise<string> {
    return this.getText(CheckoutLocators.COMPLETE_HEADER);
  }
}
