/**
 * Inventory Page Locators
 * Brother file to inventory.page.ts - follows 1:1 Page Object + Locator pattern
 */
export const InventoryLocators = {
  // Main container
  INVENTORY_CONTAINER: '.inventory_container',
  INVENTORY_LIST: '.inventory_list',
  INVENTORY_ITEMS: '.inventory_item',

  // Product details
  ITEM_NAME: '.inventory_item_name',
  ITEM_DESCRIPTION: '.inventory_item_desc',
  ITEM_PRICE: '.inventory_item_price',
  ITEM_IMAGE: '.inventory_item_img img',

  // Add to cart buttons (specific products)
  ADD_BACKPACK_BUTTON: '[data-test="add-to-cart-sauce-labs-backpack"]',
  ADD_BIKELIGHT_BUTTON: '[data-test="add-to-cart-sauce-labs-bike-light"]',
  ADD_SHIRT_BUTTON: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',

  // Generic buttons
  ADD_TO_CART_BUTTON: '[data-test^="add-to-cart"]',
  REMOVE_BUTTON: '[data-test^="remove"]',
  BACK_TO_PRODUCTS: '[data-test="back-to-products"]',

  // Header elements
  HEADER: '.header_container',
  MENU_BUTTON: '#react-burger-menu-btn',
  CART_LINK: '.shopping_cart_link',
  CART_BADGE: '[data-test="shopping-cart-badge"]',

  // Sorting
  SORT_DROPDOWN: '[data-test="product-sort-container"]',

  // Sidebar menu
  LOGOUT_BUTTON: '#logout_sidebar_link',

  // Footer
  FOOTER: '.footer',
  SOCIAL_TWITTER: '.social_twitter',
  SOCIAL_FACEBOOK: '.social_facebook',
  SOCIAL_LINKEDIN: '.social_linkedin',
} as const;
