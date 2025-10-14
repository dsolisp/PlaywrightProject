/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchEnginePage } from '../../pages/search_engine_page';

function createMockPage() {
  return {
    addInitScript: jest.fn().mockResolvedValue(undefined),
    setExtraHTTPHeaders: jest.fn().mockResolvedValue(undefined),
    goto: jest.fn().mockResolvedValue(undefined),
    waitForSelector: jest.fn().mockResolvedValue(undefined),
    fill: jest.fn().mockResolvedValue(undefined),
    press: jest.fn().mockResolvedValue(undefined),
    locator: jest.fn().mockReturnValue({
      first: () => ({ waitFor: jest.fn().mockResolvedValue(undefined) }),
      count: jest.fn().mockResolvedValue(0),
    }),
  };
}

test('navigate() for non-duckduckgo calls goto to root and does not add init script', async () => {
  const page = createMockPage();
  const se = new SearchEnginePage(page as any, 'other' as any);
  await se.navigate();
  expect(page.addInitScript).not.toHaveBeenCalled();
  expect(page.goto).toHaveBeenCalledWith('https://duckduckgo.com');
});
