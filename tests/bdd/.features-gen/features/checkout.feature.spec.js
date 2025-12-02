// Generated from: features/checkout.feature
import { test } from 'playwright-bdd';

test.describe('Checkout Process', () => {
  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => {
    if (testInfo.error) return;
    await Given('I am logged in as "standard_user"', null, { page });
    await And('I have items in my cart', null, { page });
  });

  test(
    'Complete checkout successfully',
    { tag: ['@checkout', '@smoke'] },
    async ({ When, Then, And, page }) => {
      await When('I proceed to checkout', null, { page });
      await And(
        'I enter checkout information:',
        {
          dataTable: {
            rows: [
              { cells: [{ value: 'firstName' }, { value: 'lastName' }, { value: 'postalCode' }] },
              { cells: [{ value: 'John' }, { value: 'Doe' }, { value: '12345' }] },
            ],
          },
        },
        { page },
      );
      await And('I continue to overview', null, { page });
      await And('I finish the checkout', null, { page });
      await Then('I should see the order confirmation', null, { page });
    },
  );

  test(
    'Checkout displays order total',
    { tag: ['@checkout'] },
    async ({ When, Then, And, page }) => {
      await When('I proceed to checkout', null, { page });
      await And(
        'I enter checkout information:',
        {
          dataTable: {
            rows: [
              { cells: [{ value: 'firstName' }, { value: 'lastName' }, { value: 'postalCode' }] },
              { cells: [{ value: 'Jane' }, { value: 'Smith' }, { value: '54321' }] },
            ],
          },
        },
        { page },
      );
      await And('I continue to overview', null, { page });
      await Then('I should see the order total', null, { page });
    },
  );

  test(
    'Checkout fails without required information',
    { tag: ['@checkout', '@negative'] },
    async ({ When, Then, And, page }) => {
      await When('I proceed to checkout', null, { page });
      await And('I click continue without entering information', null, { page });
      await Then('I should see a checkout error message', null, { page });
    },
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/checkout.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: 'test', box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 11,
    pickleLine: 12,
    tags: ['@checkout', '@smoke'],
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
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: 'Context',
        textWithKeyword: 'And I have items in my cart',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 12,
        gherkinStepLine: 13,
        keywordType: 'Action',
        textWithKeyword: 'When I proceed to checkout',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 13,
        gherkinStepLine: 14,
        keywordType: 'Action',
        textWithKeyword: 'And I enter checkout information:',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 14,
        gherkinStepLine: 17,
        keywordType: 'Action',
        textWithKeyword: 'And I continue to overview',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 15,
        gherkinStepLine: 18,
        keywordType: 'Action',
        textWithKeyword: 'And I finish the checkout',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 16,
        gherkinStepLine: 19,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should see the order confirmation',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 19,
    pickleLine: 21,
    tags: ['@checkout'],
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
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: 'Context',
        textWithKeyword: 'And I have items in my cart',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 20,
        gherkinStepLine: 22,
        keywordType: 'Action',
        textWithKeyword: 'When I proceed to checkout',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 21,
        gherkinStepLine: 23,
        keywordType: 'Action',
        textWithKeyword: 'And I enter checkout information:',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 22,
        gherkinStepLine: 26,
        keywordType: 'Action',
        textWithKeyword: 'And I continue to overview',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 23,
        gherkinStepLine: 27,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should see the order total',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 26,
    pickleLine: 30,
    tags: ['@checkout', '@negative'],
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
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: 'Context',
        textWithKeyword: 'And I have items in my cart',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 27,
        gherkinStepLine: 31,
        keywordType: 'Action',
        textWithKeyword: 'When I proceed to checkout',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 28,
        gherkinStepLine: 32,
        keywordType: 'Action',
        textWithKeyword: 'And I click continue without entering information',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 29,
        gherkinStepLine: 33,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should see a checkout error message',
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
