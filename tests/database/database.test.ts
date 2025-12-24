import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Database from 'better-sqlite3';
import path from 'path';

/**
 * Database tests against the Chinook sample database.
 */

describe('Database Tests', () => {
  let db: Database.Database;
  const dbPath = path.resolve('./test-data/chinook.db');

  beforeAll(() => {
    try {
      db = new Database(dbPath, { readonly: true });
    } catch {
      // Skip if database doesn't exist
      console.warn('Chinook database not found, skipping database tests');
    }
  });

  afterAll(() => {
    if (db) {
      db.close();
    }
  });

  describe('Database Connection', () => {
    it('should connect to database', () => {
      if (!db) return;
      expect(db.open).toBe(true);
    });

    it('should list tables', () => {
      if (!db) return;
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        .all() as { name: string }[];

      expect(tables.length).toBeGreaterThan(0);
      const tableNames = tables.map((t) => t.name);
      expect(tableNames).toContain('albums');
      expect(tableNames).toContain('artists');
      expect(tableNames).toContain('tracks');
    });
  });

  describe('Artists Table', () => {
    it('should query all artists', () => {
      if (!db) return;
      const artists = db.prepare('SELECT * FROM artists').all();

      expect(artists.length).toBeGreaterThan(0);
    });

    it('should query artist by ID', () => {
      if (!db) return;
      const artist = db.prepare('SELECT * FROM artists WHERE ArtistId = ?').get(1) as {
        ArtistId: number;
        Name: string;
      };

      expect(artist).toBeDefined();
      expect(artist.ArtistId).toBe(1);
      expect(artist.Name).toBeTruthy();
    });

    it('should search artists by name', () => {
      if (!db) return;
      const artists = db.prepare('SELECT * FROM artists WHERE Name LIKE ?').all('%Black%') as {
        Name: string;
      }[];

      expect(artists.length).toBeGreaterThan(0);
      expect(artists[0].Name.toLowerCase()).toContain('black');
    });
  });

  describe('Albums Table', () => {
    it('should query albums with artist join', () => {
      if (!db) return;
      const albums = db
        .prepare(
          `
          SELECT a.AlbumId, a.Title, ar.Name as ArtistName
          FROM albums a
          JOIN artists ar ON a.ArtistId = ar.ArtistId
          LIMIT 10
        `,
        )
        .all() as { AlbumId: number; Title: string; ArtistName: string }[];

      expect(albums.length).toBe(10);
      expect(albums[0]).toHaveProperty('Title');
      expect(albums[0]).toHaveProperty('ArtistName');
    });

    it('should count albums per artist', () => {
      if (!db) return;
      const counts = db
        .prepare(
          `
          SELECT ar.Name, COUNT(*) as AlbumCount
          FROM albums a
          JOIN artists ar ON a.ArtistId = ar.ArtistId
          GROUP BY ar.ArtistId
          ORDER BY AlbumCount DESC
          LIMIT 5
        `,
        )
        .all() as { Name: string; AlbumCount: number }[];

      expect(counts.length).toBe(5);
      expect(counts[0].AlbumCount).toBeGreaterThan(0);
    });
  });

  describe('Tracks Table', () => {
    it('should query tracks with album and artist', () => {
      if (!db) return;
      const tracks = db
        .prepare(
          `
          SELECT t.Name as TrackName, a.Title as AlbumTitle, ar.Name as ArtistName
          FROM tracks t
          JOIN albums a ON t.AlbumId = a.AlbumId
          JOIN artists ar ON a.ArtistId = ar.ArtistId
          LIMIT 10
        `,
        )
        .all() as { TrackName: string; AlbumTitle: string; ArtistName: string }[];

      expect(tracks.length).toBe(10);
      expect(tracks[0]).toHaveProperty('TrackName');
      expect(tracks[0]).toHaveProperty('AlbumTitle');
      expect(tracks[0]).toHaveProperty('ArtistName');
    });

    it('should calculate total track duration', () => {
      if (!db) return;
      const result = db
        .prepare('SELECT SUM(Milliseconds) / 1000.0 / 60.0 as TotalMinutes FROM tracks')
        .get() as { TotalMinutes: number };

      expect(result.TotalMinutes).toBeGreaterThan(0);
    });
  });

  describe('Aggregate Queries', () => {
    it('should get genre statistics', () => {
      if (!db) return;
      const stats = db
        .prepare(
          `
          SELECT g.Name as Genre, COUNT(*) as TrackCount
          FROM tracks t
          JOIN genres g ON t.GenreId = g.GenreId
          GROUP BY g.GenreId
          ORDER BY TrackCount DESC
        `,
        )
        .all() as { Genre: string; TrackCount: number }[];

      expect(stats.length).toBeGreaterThan(0);
    });

    it('should get invoice totals', () => {
      if (!db) return;
      const totals = db
        .prepare(
          `
          SELECT 
            strftime('%Y', InvoiceDate) as Year,
            SUM(Total) as YearlyTotal
          FROM invoices
          GROUP BY Year
          ORDER BY Year
        `,
        )
        .all() as { Year: string; YearlyTotal: number }[];

      expect(totals.length).toBeGreaterThan(0);
    });
  });
});
