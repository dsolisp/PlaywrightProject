/**
 * SauceDemo Locators
 * Matching Python's locators/sauce_locators.py exactly
 */

// ═══════════════════════════════════════════════════════════════════
// LOGIN PAGE (matching Python SauceLocators)
// ═══════════════════════════════════════════════════════════════════

export const LoginLocators = {
  // Matching Python exactly
  USERNAME_INPUT: 'input[data-test="username"]', // USERNAME_INPUT xpath
  PASSWORD_INPUT: 'input[data-test="password"]', // PASSWORD_INPUT xpath
  LOGIN_BUTTON: 'input[data-test="login-button"]', // LOGIN_BUTTON xpath
  ERROR_MESSAGE: '[data-test="error"]',
  ERROR_BUTTON: '.error-button',
  LOGO: '.login_logo',
  BOT_IMAGE: '.bot_column',
} as const;

// ═══════════════════════════════════════════════════════════════════
// INVENTORY PAGE (matching Python SauceLocators)
// ═══════════════════════════════════════════════════════════════════

export const InventoryLocators = {
  // Matching Python exactly
  INVENTORY_LIST: 'div.inventory_list', // INVENTORY_LIST xpath
  LOGOUT_BUTTON: 'a#logout_sidebar_link', // LOGOUT_BUTTON xpath

  // Product buttons (matching Python)
  ADD_BACKPACK_BUTTON: 'button[data-test="add-to-cart-sauce-labs-backpack"]',
  ADD_BIKELIGHT_BUTTON: 'button[data-test="add-to-cart-sauce-labs-bike-light"]',
  ADD_SHIRT_BUTTON: 'button[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',

  // Cart (matching Python)
  CART_BADGE: 'span[data-test="shopping-cart-badge"]',

  // Header
  HEADER: '.header_container',
  MENU_BUTTON: '#react-burger-menu-btn',
  CART_LINK: '.shopping_cart_link',

  // Products
  INVENTORY_CONTAINER: '.inventory_container',
  INVENTORY_ITEMS: '.inventory_item',
  ITEM_NAME: '.inventory_item_name',
  ITEM_DESCRIPTION: '.inventory_item_desc',
  ITEM_PRICE: '.inventory_item_price',
  ITEM_IMAGE: '.inventory_item_img img',
  ADD_TO_CART_BUTTON: 'button[data-test^="add-to-cart"]',
  REMOVE_BUTTON: 'button[data-test^="remove"]',

  // Sorting
  SORT_DROPDOWN: '[data-test="product-sort-container"]',

  // Footer
  FOOTER: '.footer',
  SOCIAL_TWITTER: '.social_twitter',
  SOCIAL_FACEBOOK: '.social_facebook',
  SOCIAL_LINKEDIN: '.social_linkedin',
} as const;

// ═══════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════

export const CartLocators = {
  CART_LIST: '.cart_list',
  CART_ITEMS: '.cart_item',
  ITEM_QUANTITY: '.cart_quantity',
  ITEM_NAME: '.inventory_item_name',
  ITEM_PRICE: '.inventory_item_price',
  REMOVE_BUTTON: 'button[data-test^="remove"]',
  CONTINUE_SHOPPING: '[data-test="continue-shopping"]',
  CHECKOUT_BUTTON: '[data-test="checkout"]',
} as const;

// ═══════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════

export const CheckoutLocators = {
  // Step 1: Information
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

  // Complete
  COMPLETE_HEADER: '.complete-header',
  COMPLETE_TEXT: '.complete-text',
  BACK_HOME: '[data-test="back-to-products"]',
} as const;

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR MENU
// ═══════════════════════════════════════════════════════════════════

export const MenuLocators = {
  MENU_CONTAINER: '.bm-menu-wrap',
  ALL_ITEMS_LINK: '#inventory_sidebar_link',
  ABOUT_LINK: '#about_sidebar_link',
  LOGOUT_LINK: '#logout_sidebar_link',
  RESET_LINK: '#reset_sidebar_link',
  CLOSE_BUTTON: '#react-burger-cross-btn',
} as const;
