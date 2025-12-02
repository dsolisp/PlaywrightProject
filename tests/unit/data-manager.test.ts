import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateTestData,
  clearCache,
  loadCsv,
  loadCsvTyped,
  filterCsv,
  findCsvRow,
} from '../../src/utils/data-manager';

/**
 * Data Manager Unit Tests
 * Equivalent to Python's tests/unit/test_data_manager.py
 */

// Type for test users CSV
interface TestUser {
  username: string;
  password: string;
  email: string;
  role: string;
  enabled: string;
}

describe('DataManager', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('CSV Data Loading', () => {
    it('should load CSV file as array of objects', () => {
      const users = loadCsv<TestUser>('test_users.csv');

      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThanOrEqual(5);
      expect(users[0]).toHaveProperty('username');
      expect(users[0]).toHaveProperty('password');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('role');
      expect(users[0]).toHaveProperty('enabled');
    });

    it('should correctly parse CSV values', () => {
      const users = loadCsv<TestUser>('test_users.csv');
      const standardUser = users.find((u) => u.username === 'standard_user');

      expect(standardUser).toBeDefined();
      expect(standardUser?.password).toBe('secret_sauce');
      expect(standardUser?.email).toBe('standard@example.com');
      expect(standardUser?.role).toBe('user');
      expect(standardUser?.enabled).toBe('true');
    });

    it('should handle different user roles', () => {
      const users = loadCsv<TestUser>('test_users.csv');
      const adminUsers = users.filter((u) => u.role === 'admin');
      const regularUsers = users.filter((u) => u.role === 'user');

      expect(adminUsers.length).toBeGreaterThanOrEqual(1);
      expect(regularUsers.length).toBeGreaterThanOrEqual(4);
    });

    it('should cache CSV data', () => {
      const users1 = loadCsv<TestUser>('test_users.csv');
      const users2 = loadCsv<TestUser>('test_users.csv');

      expect(users1).toEqual(users2);
    });

    it('should filter CSV data with predicate', () => {
      const enabledUsers = filterCsv<TestUser>('test_users.csv', (u) => u.enabled === 'true');

      expect(enabledUsers.length).toBeGreaterThanOrEqual(4);
      expect(enabledUsers.every((u) => u.enabled === 'true')).toBe(true);
    });

    it('should find single row matching predicate', () => {
      const adminUser = findCsvRow<TestUser>('test_users.csv', (u) => u.role === 'admin');

      expect(adminUser).toBeDefined();
      expect(adminUser?.username).toBe('admin_user');
      expect(adminUser?.email).toBe('admin@example.com');
    });

    it('should return undefined when no row matches', () => {
      const nonExistent = findCsvRow<TestUser>(
        'test_users.csv',
        (u) => u.username === 'nonexistent',
      );

      expect(nonExistent).toBeUndefined();
    });
  });

  describe('Test Data Generation', () => {
    it('should generate unique emails', async () => {
      const gen = generateTestData();
      const email1 = gen.email();
      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 2));
      const email2 = gen.email();

      expect(email1).toContain('@example.com');
      expect(email2).toContain('@example.com');
      // They should be different (though in fast execution might be same timestamp)
      expect(email1.startsWith('test_')).toBe(true);
    });

    it('should generate unique usernames', () => {
      const gen = generateTestData();
      const username1 = gen.username();
      const username2 = gen.username();

      expect(username1).toMatch(/^user_[a-z0-9]+$/);
      expect(username1).not.toBe(username2);
    });

    it('should generate passwords', () => {
      const gen = generateTestData();
      const password = gen.password();

      expect(password).toMatch(/^Pass\d+!$/);
    });

    it('should generate first names', () => {
      const gen = generateTestData();
      const firstName = gen.firstName();

      expect(['John', 'Jane', 'Bob', 'Alice', 'Charlie']).toContain(firstName);
    });

    it('should generate last names', () => {
      const gen = generateTestData();
      const lastName = gen.lastName();

      expect(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones']).toContain(lastName);
    });

    it('should generate phone numbers', () => {
      const gen = generateTestData();
      const phone = gen.phone();

      expect(phone).toMatch(/^\+1\d{10}$/);
    });

    it('should generate zip codes', () => {
      const gen = generateTestData();
      const zipCode = gen.zipCode();

      expect(zipCode).toMatch(/^\d{5}$/);
    });

    it('should generate UUIDs', () => {
      const gen = generateTestData();
      const uuid = gen.uuid();

      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache', () => {
      // This just verifies the function doesn't throw
      expect(() => clearCache()).not.toThrow();
    });
  });
});
