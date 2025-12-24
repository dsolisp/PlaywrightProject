// Test data factories - generate consistent test data without magic strings everywhere
import { CREDENTIALS } from '../config/constants';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export interface SearchQuery {
  term: string;
  expectedResults?: number;
}

// ═══════════════════════════════════════════════════════════════════
// USER FACTORY - all the SauceDemo test accounts
// ═══════════════════════════════════════════════════════════════════

export const UserFactory = {
  // The happy path user
  valid: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.STANDARD_USER.username,
    password: CREDENTIALS.SAUCE.STANDARD_USER.password,
  }),

  // Gets rejected at login (good for error message tests)
  locked: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.LOCKED_USER.username,
    password: CREDENTIALS.SAUCE.LOCKED_USER.password,
  }),

  // Has broken images and weird UI bugs
  problem: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.PROBLEM_USER.username,
    password: CREDENTIALS.SAUCE.PROBLEM_USER.password,
  }),

  // Artificially slow - good for timeout testing
  slow: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.PERFORMANCE_USER.username,
    password: CREDENTIALS.SAUCE.PERFORMANCE_USER.password,
  }),

  // Completely fake - tests the "bad credentials" flow
  invalid: (): UserCredentials => ({
    username: 'invalid_user',
    password: 'wrong_password',
  }),

  empty: (): UserCredentials => ({
    username: '',
    password: '',
  }),

  // Random garbage for negative tests
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

  // Each of these triggers a different validation error
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

  // Override any field you want
  custom: (data: Partial<CheckoutInfo>): CheckoutInfo => ({
    firstName: data.firstName ?? 'John',
    lastName: data.lastName ?? 'Doe',
    zipCode: data.zipCode ?? '12345',
  }),
};

// ═══════════════════════════════════════════════════════════════════
// SEARCH FACTORY - search terms for Bing tests
// ═══════════════════════════════════════════════════════════════════

export const SearchFactory = {
  playwright: (): SearchQuery => ({
    term: 'playwright automation',
    expectedResults: 10,
  }),

  typescript: (): SearchQuery => ({
    term: 'typescript tutorial',
    expectedResults: 10,
  }),

  empty: (): SearchQuery => ({
    term: '',
    expectedResults: 0,
  }),

  custom: (term: string, expectedResults = 10): SearchQuery => ({
    term,
    expectedResults,
  }),
};
