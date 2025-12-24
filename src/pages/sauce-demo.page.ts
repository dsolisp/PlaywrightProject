/**
 * SauceDemo Page Objects
 *
 * This file re-exports page objects from the sauce-demo/ directory
 * for backward compatibility. New code should import directly from:
 *   import { LoginPage } from './sauce-demo/login.page';
 *
 * Or use the barrel export:
 *   import { LoginPage, InventoryPage } from './sauce-demo';
 */
export { LoginPage } from './sauce-demo/login.page';
export { InventoryPage } from './sauce-demo/inventory.page';
export { CartPage } from './sauce-demo/cart.page';
export { CheckoutPage } from './sauce-demo/checkout.page';
