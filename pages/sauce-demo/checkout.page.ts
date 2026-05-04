import type { Page } from '@playwright/test';
import type { CheckoutInfo } from '../../utils/test-data-factory';
import { CheckoutLocators } from '../../locators/sauce-demo/checkout.locators';
import { BasePage } from '../base.page';
import { HeaderComponent } from '../../components/header.component';

/**
 * CheckoutPage — Gold Standard.
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * Handles the 3-step checkout flow: Info → Overview → Complete.
 */
export class CheckoutPage extends BasePage {
  private readonly locators: CheckoutLocators;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new CheckoutLocators(page);
    this.header = new HeaderComponent(page);
  }

  // ── Actions ────────────────────────────────────────────────────────

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.locators.firstNameInput.fill(firstName);
    await this.locators.lastNameInput.fill(lastName);
    await this.locators.postalCodeInput.fill(postalCode);
  }

  async fillWithInfo(info: CheckoutInfo): Promise<void> {
    await this.fillInformation(info.firstName, info.lastName, info.zipCode);
  }

  async continue(): Promise<void> {
    await this.locators.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.locators.finishButton.click();
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getTotal(): Promise<string> {
    return (await this.locators.totalLabel.textContent()) ?? '';
  }

  async isComplete(): Promise<boolean> {
    return this.locators.completeHeader.isVisible();
  }

  async getCompleteMessage(): Promise<string> {
    return (await this.locators.completeHeader.textContent()) ?? '';
  }

  /** Expose locator so tests can call expect() on it (Law 2). */
  completeHeaderLocator() {
    return this.locators.completeHeader;
  }
}
