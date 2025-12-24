// Bing selectors. We don't bother with Google - it blocks automation aggressively.

export const BingLocators = {
  // Search box (multiple selectors for resilience)
  SEARCH_INPUT: '#sb_form_q, input[name="q"], textarea[name="q"]',
  SEARCH_BUTTON: '#search_icon, #sb_form_go',

  // Autocomplete
  SUGGESTIONS_CONTAINER: '#sa_ul, .sa_sg',
  SUGGESTION_ITEMS: '#sa_ul li, .sa_sg li',
  SUGGESTIONS_LISTBOX: '#sa_ul',

  // Page chrome
  SITE_LOGO: '#bLogo, .b_logo',
  LANGUAGE_SETTINGS: '#id_sc',

  // Results
  RESULTS_CONTAINER: '#b_results',
  RESULTS_WRAPPER: '.sb_count',
  RESULT_TITLES: '#b_results h2',
  RESULT_ITEMS: '#b_results .b_algo',

  MAIN_SEARCH_INPUT: '#sb_form',
} as const;
