import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  logger,
  logTestStart,
  logTestEnd,
  logApiRequest,
  logPageNavigation,
  logAction,
  logError,
} from '../../src/utils/logger';

/**
 * Structured logger unit tests.
 */

describe('StructuredLogger', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => logger);
    debugSpy = vi.spyOn(logger, 'debug').mockImplementation(() => logger);
    errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Logger Instance', () => {
    it('should have logger instance defined', () => {
      expect(logger).toBeDefined();
    });

    it('should have required logging methods', () => {
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.debug).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('should have default log level', () => {
      expect(logger.level).toBeDefined();
    });
  });

  describe('logTestStart', () => {
    it('should log test start with required fields', () => {
      logTestStart('test_example', 'unit');

      expect(infoSpy).toHaveBeenCalledWith(
        'Test started',
        expect.objectContaining({
          event: 'test_start',
          testName: 'test_example',
          testType: 'unit',
        }),
      );
    });

    it('should log test start with optional browser', () => {
      logTestStart('test_example', 'web', 'chromium');

      expect(infoSpy).toHaveBeenCalledWith(
        'Test started',
        expect.objectContaining({
          event: 'test_start',
          testName: 'test_example',
          testType: 'web',
          browser: 'chromium',
        }),
      );
    });

    it('should include timestamp in test start', () => {
      logTestStart('test_example', 'unit');

      expect(infoSpy).toHaveBeenCalledWith(
        'Test started',
        expect.objectContaining({
          timestamp: expect.any(String),
        }),
      );
    });
  });

  describe('logTestEnd', () => {
    it('should log test end with passed status', () => {
      logTestEnd('test_example', 'passed', 1500);

      expect(infoSpy).toHaveBeenCalledWith(
        'Test completed',
        expect.objectContaining({
          event: 'test_end',
          testName: 'test_example',
          status: 'passed',
          durationMs: 1500,
        }),
      );
    });

    it('should log test end with failed status', () => {
      logTestEnd('test_example', 'failed', 2500);

      expect(infoSpy).toHaveBeenCalledWith(
        'Test completed',
        expect.objectContaining({
          event: 'test_end',
          testName: 'test_example',
          status: 'failed',
          durationMs: 2500,
        }),
      );
    });

    it('should log test end with skipped status', () => {
      logTestEnd('test_example', 'skipped', 0);

      expect(infoSpy).toHaveBeenCalledWith(
        'Test completed',
        expect.objectContaining({
          event: 'test_end',
          status: 'skipped',
        }),
      );
    });
  });

  describe('logApiRequest', () => {
    it('should log API request with all fields', () => {
      logApiRequest('GET', '/api/posts', 200, 150);

      expect(infoSpy).toHaveBeenCalledWith(
        'API request',
        expect.objectContaining({
          event: 'api_request',
          method: 'GET',
          url: '/api/posts',
          status: 200,
          durationMs: 150,
        }),
      );
    });

    it('should log POST request', () => {
      logApiRequest('POST', '/api/users', 201, 250);

      expect(infoSpy).toHaveBeenCalledWith(
        'API request',
        expect.objectContaining({
          method: 'POST',
          status: 201,
        }),
      );
    });
  });

  describe('logPageNavigation', () => {
    it('should log page navigation', () => {
      logPageNavigation('https://example.com', 1200);

      expect(infoSpy).toHaveBeenCalledWith(
        'Page navigation',
        expect.objectContaining({
          event: 'navigation',
          url: 'https://example.com',
          durationMs: 1200,
        }),
      );
    });
  });

  describe('logAction', () => {
    it('should log action without value', () => {
      logAction('click', 'button#submit');

      expect(debugSpy).toHaveBeenCalledWith(
        'User action',
        expect.objectContaining({
          event: 'action',
          action: 'click',
          element: 'button#submit',
        }),
      );
    });

    it('should log action with value', () => {
      logAction('type', 'input#username', 'testuser');

      expect(debugSpy).toHaveBeenCalledWith(
        'User action',
        expect.objectContaining({
          event: 'action',
          action: 'type',
          element: 'input#username',
          value: 'testuser',
        }),
      );
    });
  });

  describe('logError', () => {
    it('should log error with message and error object', () => {
      const error = new Error('Test error');
      logError('Something went wrong', error);

      expect(errorSpy).toHaveBeenCalledWith(
        'Something went wrong',
        expect.objectContaining({
          event: 'error',
          errorMessage: 'Test error',
          errorStack: expect.any(String),
        }),
      );
    });

    it('should log error with additional context', () => {
      const error = new Error('Network error');
      logError('API call failed', error, { endpoint: '/api/data', retries: 3 });

      expect(errorSpy).toHaveBeenCalledWith(
        'API call failed',
        expect.objectContaining({
          event: 'error',
          errorMessage: 'Network error',
          endpoint: '/api/data',
          retries: 3,
        }),
      );
    });
  });
});
