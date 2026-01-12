// Test data factories - generate consistent test data without magic strings everywhere
// Single source of truth for all test data generation

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

// ═══════════════════════════════════════════════════════════════════
// SAUCE DEMO TEST ACCOUNTS (hardcoded - these are public demo credentials)
// ═══════════════════════════════════════════════════════════════════

const SAUCE_ACCOUNTS = {
  STANDARD: { username: 'standard_user', password: 'secret_sauce' },
  LOCKED: { username: 'locked_out_user', password: 'secret_sauce' },
  PROBLEM: { username: 'problem_user', password: 'secret_sauce' },
  PERFORMANCE: { username: 'performance_glitch_user', password: 'secret_sauce' },
} as const;

// ═══════════════════════════════════════════════════════════════════
// USER FACTORY - all the SauceDemo test accounts
// ═══════════════════════════════════════════════════════════════════

export const UserFactory = {
  valid: (): UserCredentials => ({ ...SAUCE_ACCOUNTS.STANDARD }),

  locked: (): UserCredentials => ({ ...SAUCE_ACCOUNTS.LOCKED }),

  problem: (): UserCredentials => ({ ...SAUCE_ACCOUNTS.PROBLEM }),

  slow: (): UserCredentials => ({ ...SAUCE_ACCOUNTS.PERFORMANCE }),

  invalid: (): UserCredentials => ({
    username: 'invalid_user',
    password: 'wrong_password',
  }),

  empty: (): UserCredentials => ({
    username: '',
    password: '',
  }),

  random: (): UserCredentials => ({
    username: `user_${Date.now()}`,
    password: `pass_${Math.random().toString(36).substring(7)}`,
  }),
};

// ═══════════════════════════════════════════════════════════════════
// CHECKOUT FACTORY - form data for the checkout flow
// ═══════════════════════════════════════════════════════════════════

export const CheckoutFactory = {
  valid: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '12345',
  }),

  empty: (): CheckoutInfo => ({
    firstName: '',
    lastName: '',
    zipCode: '',
  }),

  missingFirstName: (): CheckoutInfo => ({
    firstName: '',
    lastName: 'Doe',
    zipCode: '12345',
  }),

  missingLastName: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: '',
    zipCode: '12345',
  }),

  missingZipCode: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '',
  }),

  custom: (data: Partial<CheckoutInfo>): CheckoutInfo => ({
    firstName: data.firstName ?? 'John',
    lastName: data.lastName ?? 'Doe',
    zipCode: data.zipCode ?? '12345',
  }),
};

// ═══════════════════════════════════════════════════════════════════
// RANDOM DATA GENERATOR - for generating unique test data
// ═══════════════════════════════════════════════════════════════════

export function generateTestData() {
  return {
    email: () => `test_${Date.now()}@example.com`,
    username: () => `user_${Math.random().toString(36).substring(7)}`,
    password: () => `Pass${Math.floor(Math.random() * 10000)}!`,
    firstName: () => ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][Math.floor(Math.random() * 5)],
    lastName: () =>
      ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
    phone: () => `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    zipCode: () => String(Math.floor(Math.random() * 90000 + 10000)),
    uuid: () => crypto.randomUUID(),
  };
}
