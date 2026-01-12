/**
 * Search Engine (Bing) Locators
 * Brother file to search.page.ts - follows 1:1 Page Object + Locator pattern
 */
export const SearchLocators = {
  // Search input (multiple selectors for resilience)
  SEARCH_INPUT: '#sb_form_q, input[name="q"], textarea[name="q"]',
  SEARCH_BUTTON: '#search_icon, #sb_form_go',
  MAIN_SEARCH_FORM: '#sb_form',

  // Autocomplete suggestions
  SUGGESTIONS_CONTAINER: '#sa_ul, .sa_sg',
  SUGGESTION_ITEMS: '#sa_ul li, .sa_sg li',
  SUGGESTIONS_LISTBOX: '#sa_ul',

  // Page chrome
  SITE_LOGO: '#bLogo, .b_logo',
  LANGUAGE_SETTINGS: '#id_sc',

  // Search results
  RESULTS_CONTAINER: '#b_results',
  RESULTS_WRAPPER: '.sb_count',
  RESULT_TITLES: '#b_results h2',
  RESULT_ITEMS: '#b_results .b_algo',
} as const;
