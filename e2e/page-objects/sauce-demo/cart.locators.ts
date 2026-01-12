/**
 * Cart Page Locators
 * Brother file to cart.page.ts - follows 1:1 Page Object + Locator pattern
 */
export const CartLocators = {
  // Cart container
  CART_LIST: '.cart_list',
  CART_ITEMS: '.cart_item',

  // Item details
  ITEM_QUANTITY: '.cart_quantity',
  ITEM_NAME: '.inventory_item_name',
  ITEM_PRICE: '.inventory_item_price',

  // Actions
  REMOVE_BUTTON: '[data-test^="remove"]',
  CONTINUE_SHOPPING: '[data-test="continue-shopping"]',
  CHECKOUT_BUTTON: '[data-test="checkout"]',
} as const;
