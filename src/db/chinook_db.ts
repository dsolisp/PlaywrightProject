import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, 'chinook.db');

export class ChinookDB {
  db: Database.Database;

  constructor(dbPath = DB_PATH) {
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Chinook DB not found at ${dbPath}. Please ensure src/db/chinook.db exists.`);
    }
    this.db = new Database(dbPath, { readonly: true });
  }

  listArtists() {
    const stmt = this.db.prepare('SELECT ArtistId, Name FROM Artist');
    return stmt.all() as Array<{ ArtistId: number; Name: string }>;
  }

  listAlbumsByArtist(artistId: number) {
    const stmt = this.db.prepare('SELECT AlbumId, Title FROM Album WHERE ArtistId = ?');
    return stmt.all(artistId) as Array<{ AlbumId: number; Title: string }>;
  }

  topTracks(limit = 10) {
    const stmt = this.db.prepare(
      'SELECT TrackId, Name, Milliseconds FROM Track ORDER BY Milliseconds DESC LIMIT ?',
    );
    return stmt.all(limit) as Array<{ TrackId: number; Name: string; Milliseconds: number }>;
  }
}
