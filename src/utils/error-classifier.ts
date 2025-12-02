/**
 * Smart Error Classifier
 * Equivalent to Python's utils/error_handler.py and Java's ErrorClassifier.java
 */

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ErrorCategory =
  | 'NETWORK'
  | 'ELEMENT_NOT_FOUND'
  | 'STALE_ELEMENT'
  | 'TIMEOUT'
  | 'AUTHENTICATION'
  | 'API_ERROR'
  | 'BROWSER_ERROR'
  | 'ASSERTION_ERROR'
  | 'DATA_ERROR'
  | 'ENVIRONMENT'
  | 'UNKNOWN';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RecoveryStrategy =
  | 'FAIL_FAST'
  | 'RETRY_IMMEDIATE'
  | 'RETRY_WITH_WAIT'
  | 'RETRY_WITH_BACKOFF'
  | 'RETRY_WITH_INCREASED_TIMEOUT'
  | 'RESTART_SESSION';

export interface ErrorContext {
  category: ErrorCategory;
  severity: Severity;
  message: string;
  suggestion: string;
  recoveryStrategy: RecoveryStrategy;
  originalError?: Error;
  timestamp: Date;
}

// ═══════════════════════════════════════════════════════════════════
// ERROR PATTERNS
// ═══════════════════════════════════════════════════════════════════

interface ErrorPattern {
  pattern: RegExp;
  category: ErrorCategory;
  severity: Severity;
  suggestion: string;
  recoveryStrategy: RecoveryStrategy;
}

const ERROR_PATTERNS: ErrorPattern[] = [
  // Timeout errors (check before network to avoid false matches)
  {
    pattern: /timeout.*(exceeded|expired|waiting)|timed out|waiting.*timeout/i,
    category: 'TIMEOUT',
    severity: 'MEDIUM',
    suggestion: 'Operation timed out - increase timeout or check performance',
    recoveryStrategy: 'RETRY_WITH_INCREASED_TIMEOUT',
  },

  // Network errors
  {
    pattern: /connection|connect|network|socket|dns|host.*(refused|failed|error)/i,
    category: 'NETWORK',
    severity: 'HIGH',
    suggestion: 'Check network connectivity and server availability',
    recoveryStrategy: 'RETRY_WITH_BACKOFF',
  },
  {
    pattern: /ssl|tls|certificate|handshake.*(error|failed|invalid)/i,
    category: 'NETWORK',
    severity: 'HIGH',
    suggestion: 'SSL/TLS certificate issue - check certificate validity',
    recoveryStrategy: 'FAIL_FAST',
  },

  // Element not found
  {
    pattern: /element|locator|selector.*(not found|not visible|not present|could not)/i,
    category: 'ELEMENT_NOT_FOUND',
    severity: 'MEDIUM',
    suggestion: 'Element not found - check locators and page load state',
    recoveryStrategy: 'RETRY_WITH_WAIT',
  },
  {
    pattern: /strict mode violation|resolved to \d+ elements/i,
    category: 'ELEMENT_NOT_FOUND',
    severity: 'MEDIUM',
    suggestion: 'Multiple elements matched - use more specific locator',
    recoveryStrategy: 'FAIL_FAST',
  },

  // Authentication errors
  {
    pattern:
      /(401|403|unauthorized|forbidden|access denied|authentication).*(failed|error|invalid)/i,
    category: 'AUTHENTICATION',
    severity: 'HIGH',
    suggestion: 'Authentication failed - verify credentials',
    recoveryStrategy: 'FAIL_FAST',
  },

  // API errors
  {
    pattern: /(api|rest|http).*(error|failed|500|502|503|504)/i,
    category: 'API_ERROR',
    severity: 'HIGH',
    suggestion: 'API error - check server status and request payload',
    recoveryStrategy: 'RETRY_WITH_BACKOFF',
  },

  // Browser errors
  {
    pattern: /browser|page.*(crash|closed|context)/i,
    category: 'BROWSER_ERROR',
    severity: 'CRITICAL',
    suggestion: 'Browser crashed or closed - restart browser context',
    recoveryStrategy: 'RESTART_SESSION',
  },

  // Assertion errors
  {
    pattern: /expect|assert|should|mismatch/i,
    category: 'ASSERTION_ERROR',
    severity: 'LOW',
    suggestion: 'Assertion failed - verify expected vs actual values',
    recoveryStrategy: 'FAIL_FAST',
  },
];

// ═══════════════════════════════════════════════════════════════════
// CLASSIFIER
// ═══════════════════════════════════════════════════════════════════

/**
 * Classify an error and return context
 */
export function classifyError(error: Error | string): ErrorContext {
  const message = typeof error === 'string' ? error : error.message;
  const originalError = typeof error === 'string' ? undefined : error;

  for (const pattern of ERROR_PATTERNS) {
    if (pattern.pattern.test(message)) {
      return {
        category: pattern.category,
        severity: pattern.severity,
        message,
        suggestion: pattern.suggestion,
        recoveryStrategy: pattern.recoveryStrategy,
        originalError,
        timestamp: new Date(),
      };
    }
  }

  // Default classification
  return {
    category: 'UNKNOWN',
    severity: 'MEDIUM',
    message,
    suggestion: 'Unknown error - check logs for details',
    recoveryStrategy: 'RETRY_WITH_BACKOFF',
    originalError,
    timestamp: new Date(),
  };
}

/**
 * Check if error is retryable
 */
export function isRetryable(context: ErrorContext): boolean {
  return context.recoveryStrategy !== 'FAIL_FAST';
}

/**
 * Get retry delay in ms
 */
export function getRetryDelay(context: ErrorContext, attempt: number): number {
  switch (context.recoveryStrategy) {
    case 'RETRY_IMMEDIATE':
      return 0;
    case 'RETRY_WITH_WAIT':
      return 1000 * attempt;
    case 'RETRY_WITH_BACKOFF':
      return 1000 * Math.pow(2, attempt - 1);
    case 'RETRY_WITH_INCREASED_TIMEOUT':
      return 2000 * attempt;
    default:
      return -1;
  }
}
