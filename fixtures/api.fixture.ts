import { test as base, expect, APIRequestContext } from '@playwright/test';

type ApiFixtures = {
  authenticatedSession: APIRequestContext;
  apiContext: APIRequestContext;
};

/**
 * API Seeding Fixtures
 * Why: UI login = 2-3s. API token = 50ms. 60x faster, parallel-safe.
 */
export const apiTest = base.extend<ApiFixtures>({
  apiContext: async ({ request }, use) => {
    // Setup generic API context if needed
    await use(request);
  },
  authenticatedSession: async ({ request }, use) => {
    // In a real app, this would get a real token.
    // For our demo, we just mock the pattern.
    // Apply headers or cookies directly to the request context
    // request.post('/api/login', { data: { username: '...', password: '...' } });
    
    await use(request);
    
    // Cleanup code goes here
  },
});

export { expect };
