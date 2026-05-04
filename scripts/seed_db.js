import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../app.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new sqlite3(dbPath);

db.exec('CREATE TABLE users (id INT, username TEXT, role TEXT)');
db.prepare('INSERT INTO users VALUES (?, ?, ?)').run(1, 'standard_user', 'customer');
db.prepare('INSERT INTO users VALUES (?, ?, ?)').run(2, 'admin_user', 'admin');

db.exec('CREATE TABLE products (id INT, name TEXT, price REAL)');
db.prepare('INSERT INTO products VALUES (?, ?, ?)').run(1, 'Sauce Labs Backpack', 29.99);

console.log('✅ Playwright Database Seeded.');
db.close();
