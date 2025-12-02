// Generated from: features/login.feature
import { test } from 'playwright-bdd';

test.describe('SauceDemo Login', () => {
  test.beforeEach('Background', async ({ Given, page }, testInfo) => {
    if (testInfo.error) return;
    await Given('I am on the login page', null, { page });
  });

  test(
    'Successful login with standard user',
    { tag: ['@login', '@smoke'] },
    async ({ When, Then, And, page }) => {
      await When('I enter username "standard_user"', null, { page });
      await And('I enter password "secret_sauce"', null, { page });
      await And('I click the login button', null, { page });
      await Then('I should be on the inventory page', null, { page });
      await And('I should see products displayed', null, { page });
    },
  );

  test(
    'Login fails with locked out user',
    { tag: ['@login', '@negative'] },
    async ({ When, Then, And, page }) => {
      await When('I enter username "locked_out_user"', null, { page });
      await And('I enter password "secret_sauce"', null, { page });
      await And('I click the login button', null, { page });
      await Then('I should see an error message containing "locked out"', null, { page });
    },
  );

  test(
    'Login fails with invalid credentials',
    { tag: ['@login', '@negative'] },
    async ({ When, Then, And, page }) => {
      await When('I enter username "invalid_user"', null, { page });
      await And('I enter password "wrong_password"', null, { page });
      await And('I click the login button', null, { page });
      await Then(
        'I should see an error message containing "Username and password do not match"',
        null,
        { page },
      );
    },
  );

  test.describe('Login with different users', () => {
    test('Example #1', { tag: ['@login', '@data-driven'] }, async ({ When, Then, And, page }) => {
      await When('I enter username "standard_user"', null, { page });
      await And('I enter password "secret_sauce"', null, { page });
      await And('I click the login button', null, { page });
      await Then('I should be on the inventory page', null, { page });
    });

    test('Example #2', { tag: ['@login', '@data-driven'] }, async ({ When, Then, And, page }) => {
      await When('I enter username "problem_user"', null, { page });
      await And('I enter password "secret_sauce"', null, { page });
      await And('I click the login button', null, { page });
      await Then('I should be on the inventory page', null, { page });
    });

    test('Example #3', { tag: ['@login', '@data-driven'] }, async ({ When, Then, And, page }) => {
      await When('I enter username "performance_glitch_user"', null, { page });
      await And('I enter password "secret_sauce"', null, { page });
      await And('I click the login button', null, { page });
      await Then('I should be on the inventory page', null, { page });
    });
  });
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: 'test', box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 10,
    pickleLine: 11,
    tags: ['@login', '@smoke'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 11,
        gherkinStepLine: 12,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "standard_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"standard_user"',
              children: [
                { start: 18, value: 'standard_user', children: [{ children: [] }] },
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
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "secret_sauce"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"secret_sauce"',
              children: [
                { start: 18, value: 'secret_sauce', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 13,
        gherkinStepLine: 14,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 14,
        gherkinStepLine: 15,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should be on the inventory page',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 15,
        gherkinStepLine: 16,
        keywordType: 'Outcome',
        textWithKeyword: 'And I should see products displayed',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 18,
    pickleLine: 19,
    tags: ['@login', '@negative'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 19,
        gherkinStepLine: 20,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "locked_out_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"locked_out_user"',
              children: [
                { start: 18, value: 'locked_out_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 20,
        gherkinStepLine: 21,
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "secret_sauce"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"secret_sauce"',
              children: [
                { start: 18, value: 'secret_sauce', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 21,
        gherkinStepLine: 22,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 22,
        gherkinStepLine: 23,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should see an error message containing "locked out"',
        stepMatchArguments: [
          {
            group: {
              start: 41,
              value: '"locked out"',
              children: [
                { start: 42, value: 'locked out', children: [{ children: [] }] },
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
    pwTestLine: 25,
    pickleLine: 26,
    tags: ['@login', '@negative'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 26,
        gherkinStepLine: 27,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "invalid_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"invalid_user"',
              children: [
                { start: 18, value: 'invalid_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 27,
        gherkinStepLine: 28,
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "wrong_password"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"wrong_password"',
              children: [
                { start: 18, value: 'wrong_password', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 28,
        gherkinStepLine: 29,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 29,
        gherkinStepLine: 30,
        keywordType: 'Outcome',
        textWithKeyword:
          'Then I should see an error message containing "Username and password do not match"',
        stepMatchArguments: [
          {
            group: {
              start: 41,
              value: '"Username and password do not match"',
              children: [
                {
                  start: 42,
                  value: 'Username and password do not match',
                  children: [{ children: [] }],
                },
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
    pwTestLine: 34,
    pickleLine: 41,
    tags: ['@login', '@data-driven'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 35,
        gherkinStepLine: 34,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "standard_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"standard_user"',
              children: [
                { start: 18, value: 'standard_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 36,
        gherkinStepLine: 35,
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "secret_sauce"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"secret_sauce"',
              children: [
                { start: 18, value: 'secret_sauce', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 37,
        gherkinStepLine: 36,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 38,
        gherkinStepLine: 37,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should be on the inventory page',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 41,
    pickleLine: 42,
    tags: ['@login', '@data-driven'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 42,
        gherkinStepLine: 34,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "problem_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"problem_user"',
              children: [
                { start: 18, value: 'problem_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 43,
        gherkinStepLine: 35,
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "secret_sauce"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"secret_sauce"',
              children: [
                { start: 18, value: 'secret_sauce', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 44,
        gherkinStepLine: 36,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 45,
        gherkinStepLine: 37,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should be on the inventory page',
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 48,
    pickleLine: 43,
    tags: ['@login', '@data-driven'],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: 'Context',
        textWithKeyword: 'Given I am on the login page',
        isBg: true,
        stepMatchArguments: [],
      },
      {
        pwStepLine: 49,
        gherkinStepLine: 34,
        keywordType: 'Action',
        textWithKeyword: 'When I enter username "performance_glitch_user"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"performance_glitch_user"',
              children: [
                { start: 18, value: 'performance_glitch_user', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 50,
        gherkinStepLine: 35,
        keywordType: 'Action',
        textWithKeyword: 'And I enter password "secret_sauce"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"secret_sauce"',
              children: [
                { start: 18, value: 'secret_sauce', children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: 'string',
          },
        ],
      },
      {
        pwStepLine: 51,
        gherkinStepLine: 36,
        keywordType: 'Action',
        textWithKeyword: 'And I click the login button',
        stepMatchArguments: [],
      },
      {
        pwStepLine: 52,
        gherkinStepLine: 37,
        keywordType: 'Outcome',
        textWithKeyword: 'Then I should be on the inventory page',
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
