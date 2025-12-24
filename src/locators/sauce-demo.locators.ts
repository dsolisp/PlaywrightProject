// Selectors for SauceDemo. We prefer data-test attributes when available
// (they're stable), but fall back to classes for containers and decorative stuff.

// ═══════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════

export const LoginLocators = {
  USERNAME_INPUT: 'input[data-test="username"]',
  PASSWORD_INPUT: 'input[data-test="password"]',
  LOGIN_BUTTON: 'input[data-test="login-button"]',
  ERROR_MESSAGE: '[data-test="error"]',
  ERROR_BUTTON: '.error-button', // no data-test on this one
  LOGO: '.login_logo',
  BOT_IMAGE: '.bot_column',
} as const;

// ═══════════════════════════════════════════════════════════════════
// INVENTORY PAGE (product listing)
// ═══════════════════════════════════════════════════════════════════

export const InventoryLocators = {
  INVENTORY_LIST: 'div.inventory_list',
  LOGOUT_BUTTON: 'a#logout_sidebar_link',

  // Product-specific add buttons (stable data-test attrs)
  ADD_BACKPACK_BUTTON: 'button[data-test="add-to-cart-sauce-labs-backpack"]',
  ADD_BIKELIGHT_BUTTON: 'button[data-test="add-to-cart-sauce-labs-bike-light"]',
  ADD_SHIRT_BUTTON: 'button[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
  CART_BADGE: 'span[data-test="shopping-cart-badge"]',

  // Header
  HEADER: '.header_container',
  MENU_BUTTON: '#react-burger-menu-btn',
  CART_LINK: '.shopping_cart_link',

  // Product cards
  INVENTORY_CONTAINER: '.inventory_container',
  INVENTORY_ITEMS: '.inventory_item',
  ITEM_NAME: '.inventory_item_name',
  ITEM_DESCRIPTION: '.inventory_item_desc',
  ITEM_PRICE: '.inventory_item_price',
  ITEM_IMAGE: '.inventory_item_img img',
  ADD_TO_CART_BUTTON: 'button[data-test^="add-to-cart"]', // matches any add button
  REMOVE_BUTTON: 'button[data-test^="remove"]',

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
// CHECKOUT PAGE (3-step flow: info → overview → complete)
// ═══════════════════════════════════════════════════════════════════

export const CheckoutLocators = {
  // Step 1: Your info
  FIRST_NAME: '[data-test="firstName"]',
  LAST_NAME: '[data-test="lastName"]',
  POSTAL_CODE: '[data-test="postalCode"]',
  CONTINUE_BUTTON: '[data-test="continue"]',
  CANCEL_BUTTON: '[data-test="cancel"]',
  ERROR_MESSAGE: '[data-test="error"]',

  // Step 2: Order summary
  SUMMARY_INFO: '.summary_info',
  ITEM_TOTAL: '.summary_subtotal_label',
  TAX: '.summary_tax_label',
  TOTAL: '.summary_total_label',
  FINISH_BUTTON: '[data-test="finish"]',

  // Step 3: Done
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
