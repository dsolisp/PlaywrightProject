import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, logApiRequest } from '../../src/utils/logger';

describe('StructuredLogger', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => logger);
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
});
