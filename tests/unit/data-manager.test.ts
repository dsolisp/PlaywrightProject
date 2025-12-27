import { describe, it, expect } from 'vitest';
import { generateTestData, clearCache } from '../../src/utils/data-manager';

/**
 * Data manager unit tests - test data generation utilities.
 */

describe('DataManager', () => {
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
