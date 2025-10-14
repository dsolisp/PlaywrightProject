import Database from 'better-sqlite3';

export interface RecentSearch {
  id: number;
  query: string;
  created_at: string;
}

export class SearchDB {
  db: Database.Database;

  constructor(path = ':memory:') {
    this.db = new Database(path);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recent_searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  save(query: string) {
    const stmt = this.db.prepare('INSERT INTO recent_searches (query) VALUES (?)');
    const info = stmt.run(query);
    return info.lastInsertRowid as number;
  }

  list(limit = 10): RecentSearch[] {
    const stmt = this.db.prepare(
      'SELECT id, query, created_at FROM recent_searches ORDER BY id DESC LIMIT ?',
    );
    return stmt.all(limit) as RecentSearch[];
  }
}
