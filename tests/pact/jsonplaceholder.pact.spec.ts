import { test, expect } from '@playwright/test';
import { Pact } from '@pact-foundation/pact';

test.describe('Pact Consumer Contract (JSONPlaceholder) @pact', () => {
  test('GET /posts/1 returns a post', async ({ request }) => {
    const provider = new Pact({
      consumer: 'PlaywrightProject',
      provider: 'JSONPlaceholder',
      dir: 'pacts',
      logLevel: 'warn',
    });

    await provider.setup();

    await provider.addInteraction({
      state: 'a post with id 1 exists',
      uponReceiving: 'a request for post 1',
      withRequest: {
        method: 'GET',
        path: '/posts/1',
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: {
          userId: 1,
          id: 1,
          title: 'hello',
          body: 'world',
        },
      },
    });

    const res = await request.get(`${provider.mockService.baseUrl}/posts/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('id', 1);

    await provider.verify();
    await provider.finalize();
  });
});
