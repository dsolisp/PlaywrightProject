import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { parse as csvParse } from 'csv-parse/sync';
import { PATHS } from '../config/constants';

/**
 * Test Data Manager
 * Equivalent to Python's utils/test_data_manager.py
 */

// Cache for loaded data
const cache = new Map<string, { data: unknown; loadedAt: number }>();
const CACHE_TTL_MS = 300000; // 5 minutes

// ═══════════════════════════════════════════════════════════════════
// FILE LOADING
// ═══════════════════════════════════════════════════════════════════

/**
 * Load JSON file
 */
export function loadJson<T = Record<string, unknown>>(filename: string): T {
  const cacheKey = `json:${filename}`;
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  const filePath = resolvePath(filename, '.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content) as T;

  setCache(cacheKey, data);
  return data;
}

/**
 * Load YAML file
 */
export function loadYaml<T = Record<string, unknown>>(filename: string): T {
  const cacheKey = `yaml:${filename}`;
  const cached = getFromCache<T>(cacheKey);
  if (cached) return cached;

  const filePath = resolvePath(filename, '.yml', '.yaml');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.load(content) as T;

  setCache(cacheKey, data);
  return data;
}

/**
 * CSV parsing options for csv-parse library
 */
interface CsvOptions {
  columns?: boolean | string[];
  skip_empty_lines?: boolean;
  trim?: boolean;
  cast?: boolean;
  delimiter?: string;
}

/**
 * Load CSV file as array of objects using csv-parse library
 * Supports quoted fields, escaped characters, and various delimiters
 */
export function loadCsv<T = Record<string, string>>(
  filename: string,
  options: CsvOptions = {},
): T[] {
  const cacheKey = `csv:${filename}:${JSON.stringify(options)}`;
  const cached = getFromCache<T[]>(cacheKey);
  if (cached) return cached;

  const filePath = resolvePath(filename, '.csv');
  const content = fs.readFileSync(filePath, 'utf-8');

  const parseOptions = {
    columns: options.columns ?? true,
    skip_empty_lines: options.skip_empty_lines ?? true,
    trim: options.trim ?? true,
    cast: options.cast ?? false,
    delimiter: options.delimiter ?? ',',
  };

  const data = csvParse(content, parseOptions) as T[];

  setCache(cacheKey, data);
  return data;
}

/**
 * Load CSV file with automatic type casting
 * Converts numeric strings to numbers, 'true'/'false' to booleans
 */
export function loadCsvTyped<T = Record<string, unknown>>(filename: string): T[] {
  return loadCsv<T>(filename, { cast: true });
}

/**
 * Load CSV file with custom column names
 */
export function loadCsvWithColumns<T = Record<string, string>>(
  filename: string,
  columns: string[],
): T[] {
  return loadCsv<T>(filename, { columns });
}

/**
 * Filter CSV data by a predicate function
 */
export function filterCsv<T = Record<string, string>>(
  filename: string,
  predicate: (row: T) => boolean,
): T[] {
  const data = loadCsv<T>(filename);
  return data.filter(predicate);
}

/**
 * Find first row matching a predicate
 */
export function findCsvRow<T = Record<string, string>>(
  filename: string,
  predicate: (row: T) => boolean,
): T | undefined {
  const data = loadCsv<T>(filename);
  return data.find(predicate);
}

/**
 * Auto-detect file type and load
 */
export function loadData<T = unknown>(filename: string): T {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case '.json':
      return loadJson<T>(filename);
    case '.yml':
    case '.yaml':
      return loadYaml<T>(filename);
    case '.csv':
      return loadCsv(filename) as T;
    default:
      // Try JSON first, then YAML
      try {
        return loadJson<T>(filename);
      } catch {
        return loadYaml<T>(filename);
      }
  }
}

// ═══════════════════════════════════════════════════════════════════
// DATA GENERATION
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate test data
 */
export function generateTestData() {
  return {
    email: () => `test_${Date.now()}@example.com`,
    username: () => `user_${Math.random().toString(36).substring(7)}`,
    password: () => `Pass${Math.floor(Math.random() * 10000)}!`,
    firstName: () => ['John', 'Jane', 'Bob', 'Alice', 'Charlie'][Math.floor(Math.random() * 5)],
    lastName: () =>
      ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
    phone: () => `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    zipCode: () => String(Math.floor(Math.random() * 90000 + 10000)),
    uuid: () => crypto.randomUUID(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function resolvePath(filename: string, ...extensions: string[]): string {
  const baseDir = PATHS.TEST_DATA;

  // Check if file exists with given name
  if (fs.existsSync(path.join(baseDir, filename))) {
    return path.join(baseDir, filename);
  }

  // Try with extensions
  for (const ext of extensions) {
    const fullPath = path.join(baseDir, filename + ext);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  // Return with first extension as default
  return path.join(baseDir, filename + (extensions[0] || '.json'));
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.loadedAt < CACHE_TTL_MS) {
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, loadedAt: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}
