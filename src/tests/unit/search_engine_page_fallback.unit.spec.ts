/* eslint-disable @typescript-eslint/no-explicit-any */
// Tests that exercise the non-duckduckgo fallback behavior by mocking the LOCATORS module

beforeEach(() => {
  jest.resetModules();
});

test('fallback search fills input and presses Enter and tolerates missing results', async () => {
  // Mock the locators module to expose a fake engine named 'other'
  jest.doMock('../../locators/search_engine_locators', () => ({
    LOCATORS: {
      other: {
        searchInput: '#q',
        searchButton: '#s',
        results: '.fake-result',
      },
    },
  }));

  // create a minimal mock page
  const page: any = {
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    press: jest.fn().mockResolvedValue(undefined),
    locator: jest.fn().mockReturnValue({
      first: () => ({ waitFor: jest.fn().mockRejectedValue(new Error('not found')) }),
      count: jest.fn().mockResolvedValue(0),
    }),
  };

  // dynamic import after mocking so the module import sees the mocked LOCATORS
  const mod = await import('../../pages/search_engine_page');
  const SearchEnginePage = mod.SearchEnginePage as any;

  const se = new SearchEnginePage(page, 'other');
  // call search; the final waitForSelector is in a catch on non-duckduckgo path, so it should not throw
  await se.search('query');

  expect(page.fill).toHaveBeenCalledWith('#q', 'query');
  expect(page.press).toHaveBeenCalledWith('#q', 'Enter');

  // getResultCount should call locator and return the mocked count
  const count = await se.getResultCount();
  expect(page.locator).toHaveBeenCalledWith('.fake-result');
  expect(count).toBe(0);
});
