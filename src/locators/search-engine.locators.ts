// Locators for Bing and Google search

// ═══════════════════════════════════════════════════════════════════
// BING LOCATORS
// ═══════════════════════════════════════════════════════════════════

export const BingLocators = {
  // Search elements - Bing selectors
  SEARCH_INPUT: '#sb_form_q, input[name="q"], textarea[name="q"]', // Bing search input
  SEARCH_BUTTON: '#search_icon, #sb_form_go', // Bing search button

  // Suggestions
  SUGGESTIONS_CONTAINER: '#sa_ul, .sa_sg',
  SUGGESTION_ITEMS: '#sa_ul li, .sa_sg li',
  SUGGESTIONS_LISTBOX: '#sa_ul',

  // Page elements
  SITE_LOGO: '#bLogo, .b_logo',
  LANGUAGE_SETTINGS: '#id_sc',

  // Results (Bing selectors)
  RESULTS_CONTAINER: '#b_results', // Bing results container
  RESULTS_WRAPPER: '.sb_count', // Results count
  RESULT_TITLES: '#b_results h2', // Result titles
  RESULT_ITEMS: '#b_results .b_algo', // Individual result items

  // Screenshot locator
  MAIN_SEARCH_INPUT: '#sb_form',
} as const;

// ═══════════════════════════════════════════════════════════════════
// GOOGLE LOCATORS
// ═══════════════════════════════════════════════════════════════════

export const GoogleLocators = {
  // Search form
  SEARCH_INPUT: 'textarea[name="q"], input[name="q"]',
  SEARCH_BUTTON: 'input[name="btnK"], button[aria-label="Google Search"]',
  FEELING_LUCKY: 'input[name="btnI"]',

  // Results
  RESULTS_CONTAINER: '#search',
  RESULT_ITEMS: 'div.g',
  RESULT_TITLES: 'div.g h3',
  RESULT_SNIPPETS: 'div.g div[data-sncf]',

  // Navigation
  NEXT_PAGE: '#pnnext',
  PREV_PAGE: '#pnprev',
  PAGE_NUMBERS: 'td.YyVfkd',

  // Suggestions
  SUGGESTIONS: 'ul[role="listbox"] li',

  // Knowledge panel
  KNOWLEDGE_PANEL: 'div.kp-wholepage',
} as const;
