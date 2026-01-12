/**
 * Checkout Page Locators
 * Brother file to checkout.page.ts - follows 1:1 Page Object + Locator pattern
 *
 * Checkout has 3 steps: Info → Overview → Complete
 */
export const CheckoutLocators = {
  // Step 1: Your Information
  FIRST_NAME: '[data-test="firstName"]',
  LAST_NAME: '[data-test="lastName"]',
  POSTAL_CODE: '[data-test="postalCode"]',
  CONTINUE_BUTTON: '[data-test="continue"]',
  CANCEL_BUTTON: '[data-test="cancel"]',
  ERROR_MESSAGE: '[data-test="error"]',

  // Step 2: Overview
  SUMMARY_INFO: '.summary_info',
  ITEM_TOTAL: '.summary_subtotal_label',
  TAX: '.summary_tax_label',
  TOTAL: '.summary_total_label',
  FINISH_BUTTON: '[data-test="finish"]',

  // Step 3: Complete
  COMPLETE_HEADER: '.complete-header',
  COMPLETE_TEXT: '.complete-text',
  BACK_HOME: '[data-test="back-to-products"]',
} as const;
