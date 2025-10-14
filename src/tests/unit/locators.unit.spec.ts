import { LOCATORS } from '../../locators/search_engine_locators';

describe('LOCATORS', () => {
  test('exports duckduckgo locators', () => {
    expect(LOCATORS).toBeDefined();
    expect(LOCATORS.duckduckgo).toBeDefined();
    expect(LOCATORS.duckduckgo.searchInput).toMatch(/input\[name=\"q\"\]/);
  });
});
