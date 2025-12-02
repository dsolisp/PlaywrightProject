import dotenv from 'dotenv';
import { URLS, TIMEOUTS, BROWSERS, VIEWPORTS } from './constants';

dotenv.config();

/**
 * Application Settings
 * Equivalent to Python's config/settings.py and Java's Settings.java
 */
export interface Settings {
  // URLs
  baseUrl: string;
  apiBaseUrl: string;
  sauceDemoUrl: string;

  // Browser
  browser: string;
  headless: boolean;
  viewport: { width: number; height: number };

  // Timeouts
  defaultTimeout: number;
  navigationTimeout: number;
  actionTimeout: number;
  expectTimeout: number;

  // Test execution
  parallelWorkers: number;
  retryCount: number;

  // Credentials
  sauceUsername: string;
  saucePassword: string;

  // Database
  databasePath: string;

  // Reporting
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  traceOnFailure: boolean;

  // Environment
  isCI: boolean;
  env: string;
}

/**
 * Get settings from environment variables with defaults
 */
export function getSettings(): Settings {
  return {
    // URLs
    baseUrl: process.env.BASE_URL || URLS.BING,
    apiBaseUrl: process.env.API_BASE_URL || URLS.JSON_PLACEHOLDER,
    sauceDemoUrl: process.env.SAUCE_DEMO_URL || URLS.SAUCE_DEMO,

    // Browser
    browser: process.env.BROWSER || BROWSERS.CHROMIUM,
    headless: process.env.HEADLESS !== 'false',
    viewport: VIEWPORTS.DESKTOP,

    // Timeouts
    defaultTimeout: parseInt(process.env.TIMEOUT || String(TIMEOUTS.DEFAULT), 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || String(TIMEOUTS.NAVIGATION), 10),
    actionTimeout: parseInt(process.env.ACTION_TIMEOUT || String(TIMEOUTS.ACTION), 10),
    expectTimeout: parseInt(process.env.EXPECT_TIMEOUT || String(TIMEOUTS.EXPECT), 10),

    // Test execution
    parallelWorkers: parseInt(process.env.PARALLEL_WORKERS || '4', 10),
    retryCount: parseInt(process.env.RETRY_COUNT || '2', 10),

    // Credentials
    sauceUsername: process.env.SAUCE_USERNAME || 'standard_user',
    saucePassword: process.env.SAUCE_PASSWORD || 'secret_sauce',

    // Database
    databasePath: process.env.DATABASE_PATH || './test-data/chinook.db',

    // Reporting
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    traceOnFailure: process.env.TRACE_ON_FAILURE !== 'false',

    // Environment
    isCI: process.env.CI === 'true',
    env: process.env.ENV || 'dev',
  };
}

// Singleton instance
let settingsInstance: Settings | null = null;

/**
 * Get singleton settings instance
 */
export function settings(): Settings {
  if (!settingsInstance) {
    settingsInstance = getSettings();
  }
  return settingsInstance;
}

/**
 * Reset settings (for testing)
 */
export function resetSettings(): void {
  settingsInstance = null;
}

export default settings;
