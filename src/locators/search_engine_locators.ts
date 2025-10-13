export const LOCATORS = {
  duckduckgo: {
    searchInput: 'input[name="q"]',
    searchButton: 'input[type="submit"][value="S"]',
    // DuckDuckGo can serve different DOMs (JS-heavy with `a.result__a` or
    // non-JS/html with `.result`). Keep the selector broad to match both.
    results: '.result, a.result__a, #links .result, .results_links_deep',
  },
};

export type Engine = keyof typeof LOCATORS;
