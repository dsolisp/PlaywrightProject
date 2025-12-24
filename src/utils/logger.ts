import winston from 'winston';

const { combine, timestamp, printf, colorize, json } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}] ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), json()),
  defaultMeta: { service: 'playwright-tests' },
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss.SSS' }), consoleFormat),
    }),
    new winston.transports.File({
      filename: 'test-results/logs/test.log',
      format: combine(timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'test-results/logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
    }),
  ],
});

// ── Helpers ──────────────────────────────────────────────────────────

export function logTestStart(testName: string, testType: string, browser?: string): void {
  logger.info('Test started', {
    event: 'test_start',
    testName,
    testType,
    browser,
    timestamp: new Date().toISOString(),
  });
}

export function logTestEnd(
  testName: string,
  status: 'passed' | 'failed' | 'skipped',
  durationMs: number,
): void {
  logger.info('Test completed', {
    event: 'test_end',
    testName,
    status,
    durationMs,
    timestamp: new Date().toISOString(),
  });
}

export function logApiRequest(
  method: string,
  url: string,
  status: number,
  durationMs: number,
): void {
  logger.info('API request', {
    event: 'api_request',
    method,
    url,
    status,
    durationMs,
  });
}

export function logPageNavigation(url: string, durationMs: number): void {
  logger.info('Page navigation', {
    event: 'navigation',
    url,
    durationMs,
  });
}

export function logAction(action: string, element: string, value?: string): void {
  logger.debug('User action', {
    event: 'action',
    action,
    element,
    value,
  });
}

export function logError(message: string, error: Error, context?: Record<string, unknown>): void {
  logger.error(message, {
    event: 'error',
    errorMessage: error.message,
    errorStack: error.stack,
    ...context,
  });
}

export default logger;
