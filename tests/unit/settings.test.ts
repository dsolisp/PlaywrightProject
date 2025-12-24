import { describe, it, expect, beforeEach } from 'vitest';
import { settings, resetSettings } from '../../src/config/settings';
import { URLS, BROWSERS } from '../../src/config/constants';

/**
 * Settings unit tests.
 */

describe('Settings', () => {
  beforeEach(() => {
    resetSettings();
  });

  describe('Default Values', () => {
    it('should have default base URL', () => {
      // Base URL comes from env or defaults
      expect(settings().baseUrl).toBeTruthy();
    });

    it('should have default API base URL', () => {
      expect(settings().apiBaseUrl).toBe(URLS.JSON_PLACEHOLDER);
    });

    it('should have default browser', () => {
      expect(settings().browser).toBe(BROWSERS.CHROMIUM);
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

    it('should reset instance', () => {
      const instance1 = settings();
      resetSettings();
      const instance2 = settings();
      // Objects should have same values but be different instances
      expect(instance1).not.toBe(instance2);
      expect(instance1.baseUrl).toBe(instance2.baseUrl);
    });
  });

  describe('Environment Detection', () => {
    it('should detect CI environment', () => {
      // In test environment, CI should be false unless set
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
