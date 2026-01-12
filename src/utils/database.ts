import Database from 'better-sqlite3';
import path from 'path';
import { settings } from '../../lib/config/settings';
import { logger } from './logger';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.resolve(settings().databasePath);
    logger.info(`Connecting to database: ${dbPath}`);
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

/**
 * Execute a SELECT query
 */
export function query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): T[] {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.all(...params) as T[];
}

/**
 * Execute a SELECT query and return first row
 */
export function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): T | undefined {
  const database = getDatabase();
  const stmt = database.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

/**
 * Execute a SELECT query with pagination
 */
export function queryPaginated<T = Record<string, unknown>>(
  sql: string,
  page: number = 1,
  pageSize: number = 10,
  params: unknown[] = [],
): { data: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const database = getDatabase();

  // Get total count
  const countSql = `SELECT COUNT(*) as count FROM (${sql})`;
  const countStmt = database.prepare(countSql);
  const { count } = countStmt.get(...params) as { count: number };

  // Get paginated data
  const offset = (page - 1) * pageSize;
  const paginatedSql = `${sql} LIMIT ? OFFSET ?`;
  const stmt = database.prepare(paginatedSql);
  const data = stmt.all(...params, pageSize, offset) as T[];

  return {
    data,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
}

/**
 * Get table info
 */
export function getTableInfo(tableName: string): { name: string; type: string }[] {
  // Validate table name to prevent SQL injection
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error('Invalid table name');
  }

  return query<{ name: string; type: string }>(`PRAGMA table_info(${tableName})`);
}

/**
 * Get all table names
 */
export function getTables(): string[] {
  const result = query<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
  );
  return result.map((r) => r.name);
}

/**
 * Check if table exists
 */
export function tableExists(tableName: string): boolean {
  const result = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name = ?",
    [tableName],
  );
  return (result?.count ?? 0) > 0;
}
