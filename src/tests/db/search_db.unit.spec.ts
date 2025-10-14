import { SearchDB } from '../../db/search_db';

describe('SearchDB', () => {
  it('saves and lists recent searches', () => {
    const db = new SearchDB();
    db.save('one');
    db.save('two');
    const items = db.list(5);
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0].query).toBe('two');
    expect(items[1].query).toBe('one');
  });
});
