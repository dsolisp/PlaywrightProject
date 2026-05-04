import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function seed(db) {
  // Idempotent seeding for hermetic DBs.
  db.exec('DROP TABLE IF EXISTS users');
  db.exec('DROP TABLE IF EXISTS products');

  db.exec('CREATE TABLE users (id INT, username TEXT, role TEXT)');
  db.prepare('INSERT INTO users (id, username, role) VALUES (?, ?, ?)').run(1, 'standard_user', 'customer');
  db.prepare('INSERT INTO users (id, username, role) VALUES (?, ?, ?)').run(2, 'admin_user', 'admin');

  db.exec('CREATE TABLE products (id INT, name TEXT, price REAL)');
  db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)').run(1, 'Sauce Labs Backpack', 29.99);
}

export function seedSqliteFile(dbPath) {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  const db = new sqlite3(dbPath);
  try {
    seed(db);
  } finally {
    db.close();
  }
  console.log('✅ Playwright Database Seeded.');
}

if (import.meta.url === `file://${__filename}`) {
  const dbPath = path.resolve(__dirname, '../app.db');
  seedSqliteFile(dbPath);
}
