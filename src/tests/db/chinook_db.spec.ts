import { ChinookDB } from '../../db/chinook_db';

describe('ChinookDB', () => {
  it('lists artists, albums and top tracks from the seed DB', () => {
    const db = new ChinookDB();
    const artists = db.listArtists();
    expect(artists.length).toBeGreaterThan(0);
    const albums = db.listAlbumsByArtist(1);
    expect(albums[0].Title).toBe('Greatest Hits');
    const tracks = db.topTracks(2);
    expect(tracks.length).toBeGreaterThanOrEqual(2);
  });
});
