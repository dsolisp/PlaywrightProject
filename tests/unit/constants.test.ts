// Make sure our constants are sane (positive timeouts, valid URLs, etc.)
import { describe, test, expect } from 'vitest';
import { HTTP_STATUS, PATHS, TIMEOUTS, URLS, VIEWPORTS } from '../../lib/config/constants';
import { UserFactory } from '../../lib/utils/test-data-factory';

describe('Constants Validation', () => {
  describe('Timeout Constants', () => {
    test('Default timeout should be positive', () => {
      expect(TIMEOUTS.DEFAULT).toBeGreaterThan(0);
    });

    test('Short timeout should be less than default', () => {
      expect(TIMEOUTS.SHORT).toBeLessThan(TIMEOUTS.DEFAULT);
    });

    test('Long timeout should be greater than default', () => {
      expect(TIMEOUTS.LONG).toBeGreaterThan(TIMEOUTS.DEFAULT);
    });

    test('Navigation timeout should be positive', () => {
      expect(TIMEOUTS.NAVIGATION).toBeGreaterThan(0);
    });

    test('API timeout should be positive', () => {
      expect(TIMEOUTS.API).toBeGreaterThan(0);
    });

    test('Animation timeout should be positive', () => {
      expect(TIMEOUTS.ANIMATION).toBeGreaterThan(0);
    });
  });

  describe('URL Constants', () => {
    test('Bing URL should be valid', () => {
      expect(URLS.BING).toMatch(/^https:\/\//);
      expect(URLS.BING).toContain('bing.com');
    });

    test('SauceDemo URL should be valid', () => {
      expect(URLS.SAUCE_DEMO).toMatch(/^https:\/\//);
      expect(URLS.SAUCE_DEMO).toContain('saucedemo.com');
    });

    test('API URLs should be valid', () => {
      expect(URLS.JSON_PLACEHOLDER).toMatch(/^https:\/\//);
      expect(URLS.REQRES).toMatch(/^https:\/\//);
    });
  });

  describe('HTTP Status Constants', () => {
    test('OK should be 200', () => {
      expect(HTTP_STATUS.OK).toBe(200);
    });

    test('Created should be 201', () => {
      expect(HTTP_STATUS.CREATED).toBe(201);
    });

    test('Not Found should be 404', () => {
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    });

    test('Internal Server Error should be 500', () => {
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('Viewport Constants', () => {
    test('Desktop viewport should have valid dimensions', () => {
      expect(VIEWPORTS.DESKTOP.width).toBeGreaterThan(0);
      expect(VIEWPORTS.DESKTOP.height).toBeGreaterThan(0);
    });

    test('Mobile viewport should be smaller than desktop', () => {
      expect(VIEWPORTS.MOBILE.width).toBeLessThan(VIEWPORTS.DESKTOP.width);
    });

    test('Tablet viewport should be between mobile and desktop', () => {
      expect(VIEWPORTS.TABLET.width).toBeGreaterThan(VIEWPORTS.MOBILE.width);
      expect(VIEWPORTS.TABLET.width).toBeLessThan(VIEWPORTS.DESKTOP.width);
    });
  });

  describe('UserFactory Credentials', () => {
    test('Valid user should have username and password', () => {
      const user = UserFactory.valid();
      expect(user.username).toBeTruthy();
      expect(user.password).toBeTruthy();
    });

    test('Locked user should have username and password', () => {
      const user = UserFactory.locked();
      expect(user.username).toBeTruthy();
      expect(user.password).toBeTruthy();
    });
  });

  describe('Path Constants', () => {
    test('Screenshots path should be defined', () => {
      expect(PATHS.SCREENSHOTS).toBeTruthy();
    });

    test('Reports path should be defined', () => {
      expect(PATHS.REPORTS).toBeTruthy();
    });

    test('Test data path should be defined', () => {
      expect(PATHS.TEST_DATA).toBeTruthy();
    });
  });
});
