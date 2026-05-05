import sqlite3 from 'better-sqlite3';
import fs from 'fs';

export type SeedDb = sqlite3.Database;

export function seed(db: SeedDb) {
  // Idempotent seeding for hermetic DBs.
  db.exec('DROP TABLE IF EXISTS users');
  db.exec('DROP TABLE IF EXISTS products');

  db.exec('CREATE TABLE users (id INT, username TEXT, role TEXT)');
  db.prepare('INSERT INTO users (id, username, role) VALUES (?, ?, ?)').run(
    1,
    'standard_user',
    'customer',
  );
  db.prepare('INSERT INTO users (id, username, role) VALUES (?, ?, ?)').run(
    2,
    'admin_user',
    'admin',
  );

  db.exec('CREATE TABLE products (id INT, name TEXT, price REAL)');
  db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)').run(
    1,
    'Sauce Labs Backpack',
    29.99,
  );
}

export function seedSqliteFile(dbPath: string) {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  const db = new sqlite3(dbPath);
  try {
    seed(db);
  } finally {
    db.close();
  }
  console.log('✅ Playwright Database Seeded.');
}
