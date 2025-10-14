/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchEnginePage } from '../../pages/search_engine_page';
import { LOCATORS } from '../../locators/search_engine_locators';
interface MockPage {
  addInitScript?: (...args: any[]) => Promise<void> | void;
  setExtraHTTPHeaders?: (...args: any[]) => Promise<void> | void;
  goto?: (...args: any[]) => Promise<void> | void;
  waitForSelector?: (...args: any[]) => Promise<void> | void;
  fill?: (...args: any[]) => Promise<void> | void;
  press?: (...args: any[]) => Promise<void> | void;
  locator?: (...args: any[]) => any;
  route?: (...args: any[]) => Promise<void> | void;
}

// Minimal mocked Page interface for unit testing
function createMockPage(): MockPage {
  return {
    addInitScript: jest.fn().mockResolvedValue(undefined),
    setExtraHTTPHeaders: jest.fn().mockResolvedValue(undefined),
    goto: jest.fn().mockResolvedValue(undefined),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    press: jest.fn().mockResolvedValue(undefined),
    locator: jest.fn().mockReturnValue({
      first: () => ({ waitFor: jest.fn().mockResolvedValue(undefined) }),
      count: jest.fn().mockResolvedValue(3),
    }),
    route: jest.fn().mockResolvedValue(undefined),
  };
}

describe('SearchEnginePage (unit)', () => {
  test('navigate() uses HTML endpoint and sets headers for duckduckgo', async () => {
    const page = createMockPage();
    const se = new SearchEnginePage(page as any, 'duckduckgo');
    await se.navigate();
    expect(page.addInitScript).toHaveBeenCalled();
    expect(page.setExtraHTTPHeaders).toHaveBeenCalledWith({ 'accept-language': 'en-US,en;q=0.9' });
    expect(page.goto).toHaveBeenCalledWith('https://duckduckgo.com/html/');
  });

  test('search() navigates directly to HTML results for duckduckgo', async () => {
    const page = createMockPage();
    const se = new SearchEnginePage(page as any, 'duckduckgo');
    await se.search('playwright typescript');
    const expectedUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent('playwright typescript')}`;
    expect(page.goto).toHaveBeenCalledWith(expectedUrl);
    expect(page.waitForSelector).toHaveBeenCalledWith(LOCATORS.duckduckgo.results, {
      timeout: 15000,
    });
  });

  test('getResultCount returns count from locator', async () => {
    const page = createMockPage();
    // adjust locator.count to return a number
    const locatorMock = {
      first: () => ({ waitFor: jest.fn().mockResolvedValue(undefined) }),
      count: jest.fn().mockResolvedValue(5),
    };
    (page as MockPage).locator = jest.fn().mockReturnValue(locatorMock);

    const se = new SearchEnginePage(page as any, 'duckduckgo');
    const count = await se.getResultCount();
    expect(count).toBe(5);
    expect(page.locator).toHaveBeenCalledWith(LOCATORS.duckduckgo.results);
  });
});
