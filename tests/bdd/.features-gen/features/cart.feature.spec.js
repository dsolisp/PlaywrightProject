// Generated from: features/cart.feature
import { test } from 'playwright-bdd';

test.describe('Shopping Cart', () => {
  test.beforeEach('Background', async ({ Given, page }, testInfo) => {
    if (testInfo.error) return;
    await Given('I am logged in as "standard_user"', null, { page });
  });

  test('Add single product to cart', { tag: ['@cart', '@smoke'] }, async ({ When, Then, page }) => {
    await When('I add "Sauce Labs Backpack" to the cart', null, { page });
    await Then('the cart badge should show "1"', null, { page });
  });

  test('Add multiple products to cart', { tag: ['@cart'] }, async ({ When, Then, And, page }) => {
    await When('I add "Sauce Labs Backpack" to the cart', null, { page });
    await And('I add "Sauce Labs Bike Light" to the cart', null, { page });
    await Then('the cart badge should show "2"', null, { page });
  });

  test('Remove product from cart', { tag: ['@cart'] }, async ({ Given, When, Then, page }) => {
    await Given('I have added "Sauce Labs Backpack" to the cart', null, { page });
    await When('I remove "Sauce Labs Backpack" from the cart', null, { page });
    await Then('the cart should be empty', null, { page });
  });

  test('View cart contents', { tag: ['@cart'] }, async ({ Given, When, Then, page }) => {
    await Given('I have added "Sauce Labs Backpack" to the cart', null, { page });
    await When('I go to the cart', null, { page });
    await Then('I should see "Sauce Labs Backpack" in the cart', null, { page });
  });
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/cart.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: 'test', box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 10,
    pickleLine: 11,
    tags: ['@cart', '@smoke'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am logged in as "standard_user"',
        isBg: true,
        stepMatchArguments: [
          {
            group: {
              start: 18,
              value: '"standard_user"',
              children: [
                { start: 19, value: 'standard_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 11,
        gherkinStepLine: 12,
        keywordType: 'Action',
        textWithKeyword: 'When I add "Sauce Labs Backpack" to the cart',
        stepMatchArguments: [
          {
            group: {
              start: 6,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 7, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 12,
        gherkinStepLine: 13,
        keywordType: 'Outcome',
        textWithKeyword: 'Then the cart badge should show "1"',
        stepMatchArguments: [
          {
            group: {
              start: 27,
              value: '"1"',
              children: [
                { start: 28, value: '1', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
    ],
  },
  {
    pwTestLine: 15,
    pickleLine: 15,
    tags: ['@cart'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am logged in as "standard_user"',
        isBg: true,
        stepMatchArguments: [
          {
            group: {
              start: 18,
              value: '"standard_user"',
              children: [
                { start: 19, value: 'standard_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 16,
        gherkinStepLine: 16,
        keywordType: 'Action',
        textWithKeyword: 'When I add "Sauce Labs Backpack" to the cart',
        stepMatchArguments: [
          {
            group: {
              start: 6,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 7, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 17,
        gherkinStepLine: 17,
        keywordType: 'Action',
        textWithKeyword: 'And I add "Sauce Labs Bike Light" to the cart',
        stepMatchArguments: [
          {
            group: {
              start: 6,
              value: '"Sauce Labs Bike Light"',
              children: [
                { start: 7, value: 'Sauce Labs Bike Light', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 18,
        gherkinStepLine: 18,
        keywordType: 'Outcome',
        textWithKeyword: 'Then the cart badge should show "2"',
        stepMatchArguments: [
          {
            group: {
              start: 27,
              value: '"2"',
              children: [
                { start: 28, value: '2', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
    ],
  },
  {
    pwTestLine: 21,
    pickleLine: 20,
    tags: ['@cart'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am logged in as "standard_user"',
        isBg: true,
        stepMatchArguments: [
          {
            group: {
              start: 18,
              value: '"standard_user"',
              children: [
                { start: 19, value: 'standard_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 22,
        gherkinStepLine: 21,
        keywordType: 'Context',
        textWithKeyword: 'Given I have added "Sauce Labs Backpack" to the cart',
        stepMatchArguments: [
          {
            group: {
              start: 13,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 14, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 23,
        gherkinStepLine: 22,
        keywordType: 'Action',
        textWithKeyword: 'When I remove "Sauce Labs Backpack" from the cart',
        stepMatchArguments: [
          {
            group: {
              start: 9,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 10, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 24,
        gherkinStepLine: 23,
        keywordType: 'Outcome',
        textWithKeyword: 'Then the cart should be empty',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 27,
    pickleLine: 25,
    tags: ['@cart'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am logged in as "standard_user"',
        isBg: true,
        stepMatchArguments: [
          {
            group: {
              start: 18,
              value: '"standard_user"',
              children: [
                { start: 19, value: 'standard_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 28,
        gherkinStepLine: 26,
        keywordType: 'Context',
        textWithKeyword: 'Given I have added "Sauce Labs Backpack" to the cart',
        stepMatchArguments: [
          {
            group: {
              start: 13,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 14, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 29,
        gherkinStepLine: 27,
        keywordType: 'Action',
        textWithKeyword: 'When I go to the cart',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 30,
        gherkinStepLine: 28,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should see "Sauce Labs Backpack" in the cart',
        stepMatchArguments: [
          {
            group: {
              start: 13,
              value: '"Sauce Labs Backpack"',
              children: [
                { start: 14, value: 'Sauce Labs Backpack', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
    ],
  },
]; // bdd-data-end
