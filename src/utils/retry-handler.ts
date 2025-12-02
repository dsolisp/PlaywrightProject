import { classifyError, isRetryable, getRetryDelay, ErrorContext } from './error-classifier';
import { logger } from './logger';
import { RETRY } from '../config/constants';

/**
 * Retry Handler with exponential backoff
 * Equivalent to Python's utils/error_handler.py
 */

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  retryOn?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Execute operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = RETRY.MAX_ATTEMPTS,
    delayMs = RETRY.DELAY_MS,
    backoffMultiplier = RETRY.BACKOFF_MULTIPLIER,
    retryOn,
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const context = classifyError(lastError);

      // Check if we should retry
      const shouldRetry = retryOn ? retryOn(lastError) : isRetryable(context);

      if (!shouldRetry || attempt === maxAttempts) {
        logger.error(`Operation failed after ${attempt} attempts`, {
          error: lastError.message,
          category: context.category,
          suggestion: context.suggestion,
        });
        throw lastError;
      }

      // Calculate delay
      const delay =
        getRetryDelay(context, attempt) ?? delayMs * Math.pow(backoffMultiplier, attempt - 1);

      logger.warn(`Retry attempt ${attempt}/${maxAttempts}`, {
        error: lastError.message,
        category: context.category,
        delayMs: delay,
      });

      // Call onRetry callback
      if (onRetry) {
        onRetry(lastError, attempt);
      }

      // Wait before retry
      if (delay > 0) {
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error('Operation failed');
}

/**
 * Retry decorator for class methods
 */
export function Retry(options: RetryOptions = {}) {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      return withRetry(() => originalMethod.apply(this, args), options);
    };

    return descriptor;
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for condition with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const { timeout = 10000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await sleep(interval);
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}
