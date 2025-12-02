/**
 * Test Data Factory
 * Factory pattern for generating test data with sensible defaults and variations.
 */

import { CREDENTIALS } from '../config/constants';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

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
// USER FACTORY
// ═══════════════════════════════════════════════════════════════════

export const UserFactory = {
  /** Standard valid user for successful login */
  valid: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.STANDARD_USER.username,
    password: CREDENTIALS.SAUCE.STANDARD_USER.password,
  }),

  /** Locked out user - should fail login */
  locked: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.LOCKED_USER.username,
    password: CREDENTIALS.SAUCE.LOCKED_USER.password,
  }),

  /** Problem user - has UI glitches */
  problem: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.PROBLEM_USER.username,
    password: CREDENTIALS.SAUCE.PROBLEM_USER.password,
  }),

  /** Performance glitch user - has slow responses */
  slow: (): UserCredentials => ({
    username: CREDENTIALS.SAUCE.PERFORMANCE_USER.username,
    password: CREDENTIALS.SAUCE.PERFORMANCE_USER.password,
  }),

  /** Invalid credentials - should fail login */
  invalid: (): UserCredentials => ({
    username: 'invalid_user',
    password: 'wrong_password',
  }),

  /** Empty credentials */
  empty: (): UserCredentials => ({
    username: '',
    password: '',
  }),

  /** Generate random user (for negative testing) */
  random: (): UserCredentials => ({
    username: `user_${Date.now()}`,
    password: `pass_${Math.random().toString(36).substring(7)}`,
  }),
};

// ═══════════════════════════════════════════════════════════════════
// CHECKOUT FACTORY
// ═══════════════════════════════════════════════════════════════════

export const CheckoutFactory = {
  /** Valid checkout information */
  valid: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '12345',
  }),

  /** Invalid - all empty fields */
  empty: (): CheckoutInfo => ({
    firstName: '',
    lastName: '',
    zipCode: '',
  }),

  /** Invalid - missing first name */
  missingFirstName: (): CheckoutInfo => ({
    firstName: '',
    lastName: 'Doe',
    zipCode: '12345',
  }),

  /** Invalid - missing last name */
  missingLastName: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: '',
    zipCode: '12345',
  }),

  /** Invalid - missing zip code */
  missingZipCode: (): CheckoutInfo => ({
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '',
  }),

  /** Generate with custom data */
  custom: (data: Partial<CheckoutInfo>): CheckoutInfo => ({
    firstName: data.firstName ?? 'John',
    lastName: data.lastName ?? 'Doe',
    zipCode: data.zipCode ?? '12345',
  }),
};

// ═══════════════════════════════════════════════════════════════════
// SEARCH FACTORY
// ═══════════════════════════════════════════════════════════════════

export const SearchFactory = {
  /** Common search term */
  playwright: (): SearchQuery => ({
    term: 'playwright automation',
    expectedResults: 10,
  }),

  /** Technology search */
  typescript: (): SearchQuery => ({
    term: 'typescript tutorial',
    expectedResults: 10,
  }),

  /** Empty search */
  empty: (): SearchQuery => ({
    term: '',
    expectedResults: 0,
  }),

  /** Custom search */
  custom: (term: string, expectedResults = 10): SearchQuery => ({
    term,
    expectedResults,
  }),
};
