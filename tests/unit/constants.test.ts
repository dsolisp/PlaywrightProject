// Make sure our constants are sane (positive timeouts, valid URLs, etc.)
import { describe, test, expect } from 'vitest';
import {
  BROWSERS,
  CREDENTIALS,
  HTTP_STATUS,
  PATHS,
  RETRY,
  TIMEOUTS,
  URLS,
  USER_AGENTS,
  VIEWPORTS,
} from '../../src/config/constants';

describe('Constants Validation', () => {
  describe('User Agent Constants', () => {
    test('Chrome Windows user agent should contain Chrome', () => {
      expect(USER_AGENTS.CHROME_WINDOWS).toContain('Chrome');
    });

    test('Chrome Mac user agent should contain Chrome', () => {
      expect(USER_AGENTS.CHROME_MAC).toContain('Chrome');
    });

    test('Chrome user agents should contain WebKit', () => {
      expect(USER_AGENTS.CHROME_WINDOWS).toContain('AppleWebKit');
      expect(USER_AGENTS.CHROME_MAC).toContain('AppleWebKit');
    });

    test('Firefox user agent should contain Firefox', () => {
      expect(USER_AGENTS.FIREFOX_WINDOWS).toContain('Firefox');
    });

    test('Firefox user agent should contain Gecko', () => {
      expect(USER_AGENTS.FIREFOX_WINDOWS).toContain('Gecko');
    });

    test('Safari user agent should contain Safari', () => {
      expect(USER_AGENTS.SAFARI_MAC).toContain('Safari');
    });

    test('Mobile Android user agent should contain Mobile', () => {
      expect(USER_AGENTS.MOBILE_ANDROID).toContain('Mobile');
    });

    test('Mobile iOS user agent should contain iPhone', () => {
      expect(USER_AGENTS.MOBILE_IOS).toContain('iPhone');
    });
  });

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

  describe('Browser Constants', () => {
    test('Chromium browser should be chromium', () => {
      expect(BROWSERS.CHROMIUM).toBe('chromium');
    });

    test('Firefox browser should be firefox', () => {
      expect(BROWSERS.FIREFOX).toBe('firefox');
    });

    test('WebKit browser should be webkit', () => {
      expect(BROWSERS.WEBKIT).toBe('webkit');
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

  describe('Retry Constants', () => {
    test('Max attempts should be positive', () => {
      expect(RETRY.MAX_ATTEMPTS).toBeGreaterThan(0);
    });

    test('Delay should be positive', () => {
      expect(RETRY.DELAY_MS).toBeGreaterThan(0);
    });

    test('Backoff multiplier should be greater than 1', () => {
      expect(RETRY.BACKOFF_MULTIPLIER).toBeGreaterThan(1);
    });
  });

  describe('Credentials Constants', () => {
    test('Sauce standard user should have username and password', () => {
      expect(CREDENTIALS.SAUCE.STANDARD_USER.username).toBeTruthy();
      expect(CREDENTIALS.SAUCE.STANDARD_USER.password).toBeTruthy();
    });

    test('Sauce locked user should have username and password', () => {
      expect(CREDENTIALS.SAUCE.LOCKED_USER.username).toBeTruthy();
      expect(CREDENTIALS.SAUCE.LOCKED_USER.password).toBeTruthy();
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
