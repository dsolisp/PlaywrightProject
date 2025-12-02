import { describe, it, expect } from 'vitest';
import {
  classifyError,
  isRetryable,
  getRetryDelay,
  ErrorContext,
} from '../../src/utils/error-classifier';

/**
 * Error Classifier Unit Tests
 * Equivalent to Python's tests/unit/test_error_handler.py
 */

describe('ErrorClassifier', () => {
  describe('Error Classification', () => {
    it('should classify network errors', () => {
      const result = classifyError('Connection refused');
      expect(result.category).toBe('NETWORK');
      expect(result.severity).toBe('HIGH');
    });

    it('should classify timeout errors', () => {
      const result = classifyError('Timeout exceeded waiting for element');
      expect(result.category).toBe('TIMEOUT');
      expect(result.severity).toBe('MEDIUM');
    });

    it('should classify authentication errors', () => {
      const result = classifyError('Authentication failed error');
      expect(result.category).toBe('AUTHENTICATION');
      expect(result.severity).toBe('HIGH');
    });

    it('should classify element not found errors', () => {
      const result = classifyError('Element not found in DOM');
      expect(result.category).toBe('ELEMENT_NOT_FOUND');
    });

    it('should classify browser errors', () => {
      const result = classifyError('Browser context closed');
      expect(result.category).toBe('BROWSER_ERROR');
      expect(result.severity).toBe('CRITICAL');
    });

    it('should classify assertion errors', () => {
      const result = classifyError('Expected value to match');
      expect(result.category).toBe('ASSERTION_ERROR');
    });

    it('should classify unknown errors', () => {
      const result = classifyError('Some random error message');
      expect(result.category).toBe('UNKNOWN');
    });
  });

  describe('Retry Logic', () => {
    it('should identify retryable errors', () => {
      const networkError = classifyError('Connection timeout');
      expect(isRetryable(networkError)).toBe(true);

      const authError = classifyError('Authentication failed error');
      expect(isRetryable(authError)).toBe(false);
    });

    it('should calculate retry delays', () => {
      const networkError = classifyError('Connection failed');

      // First retry
      const delay1 = getRetryDelay(networkError, 1);
      expect(delay1).toBeGreaterThanOrEqual(0);

      // Second retry (should be longer with backoff)
      const delay2 = getRetryDelay(networkError, 2);
      expect(delay2).toBeGreaterThan(delay1);
    });

    it('should return -1 for non-retryable errors', () => {
      const authError = classifyError('401 Unauthorized failed');
      const delay = getRetryDelay(authError, 1);
      expect(delay).toBe(-1);
    });
  });

  describe('Error Context', () => {
    it('should include suggestion', () => {
      const result = classifyError('Connection refused');
      expect(result.suggestion).toBeTruthy();
      expect(result.suggestion.length).toBeGreaterThan(0);
    });

    it('should include timestamp', () => {
      const result = classifyError('Some error');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should preserve original error', () => {
      const originalError = new Error('Test error');
      const result = classifyError(originalError);
      expect(result.originalError).toBe(originalError);
    });
  });
});
