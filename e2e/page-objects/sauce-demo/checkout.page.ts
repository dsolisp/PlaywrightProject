import { Page, Locator, expect } from '@playwright/test';
import { CheckoutInfo } from '../../../lib/utils/test-data-factory';

/**
 * Checkout Page Object - GEMINI Style
 * Handles the 3-step checkout flow: Info → Overview → Complete
 */
export class CheckoutPage {
  readonly page: Page;

  // Form inputs - use getByPlaceholder (most semantic for these inputs)
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  // Buttons
  readonly continueButton: Locator;
  readonly finishButton: Locator;

  // Checkout info
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form inputs - use getByPlaceholder
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');

    // Buttons - use getByRole
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });

    // Checkout info
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  // ── Assertions ─────────────────────────────────────────────────────

  async expectComplete(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
  }

  async expectCompleteMessage(message: string): Promise<void> {
    await expect(this.completeHeader).toContainText(message);
  }

  // ── Actions ────────────────────────────────────────────────────────

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async fillWithInfo(info: CheckoutInfo): Promise<void> {
    await this.fillInformation(info.firstName, info.lastName, info.zipCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async isComplete(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }

  async getCompleteMessage(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }
}
