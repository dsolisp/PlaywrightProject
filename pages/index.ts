// Page Objects — Gold Standard barrel export

// Base
export { BasePage } from './base.page';

// SauceDemo pages (1 level of inheritance: each extends BasePage)
export { LoginPage } from './sauce-demo/login.page';
export { InventoryPage } from './sauce-demo/inventory.page';
export { CartPage } from './sauce-demo/cart.page';
export { CheckoutPage } from './sauce-demo/checkout.page';

// Practice App pages (1 level of inheritance: each extends BasePage)
export { AlertsPage } from './practice/alerts.page';
export { DropdownPage } from './practice/dropdown.page';
export { IframesPage } from './practice/iframes.page';
export { WindowsPage } from './practice/windows.page';
export { SelectorsPage } from './practice/selectors.page';


