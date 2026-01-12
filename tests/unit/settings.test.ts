import { describe, it, expect } from 'vitest';
import { settings } from '../../lib/config/settings';
import { URLS } from '../../lib/config/constants';

describe('Settings', () => {
  describe('Default Values', () => {
    it('should have default base URL', () => {
      expect(settings().baseUrl).toBeTruthy();
    });

    it('should have default API base URL', () => {
      expect(settings().apiBaseUrl).toBe(URLS.JSON_PLACEHOLDER);
    });

    it('should have default browser', () => {
      expect(settings().browser).toBe('chromium');
    });

    it('should have headless true by default', () => {
      expect(settings().headless).toBe(true);
    });

    it('should have default timeout values', () => {
      expect(settings().defaultTimeout).toBeGreaterThan(0);
      expect(settings().navigationTimeout).toBeGreaterThan(0);
      expect(settings().actionTimeout).toBeGreaterThan(0);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = settings();
      const instance2 = settings();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Environment Detection', () => {
    it('should detect CI environment', () => {
      expect(typeof settings().isCI).toBe('boolean');
    });

    it('should have default environment', () => {
      expect(settings().env).toBe('dev');
    });
  });

  describe('Credentials', () => {
    it('should have default Sauce credentials', () => {
      expect(settings().sauceUsername).toBe('standard_user');
      expect(settings().saucePassword).toBe('secret_sauce');
    });
  });
});
