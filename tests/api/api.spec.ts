import { test, expect } from '@playwright/test';
import { HTTP_STATUS, API_BASE_URL } from '../../src/config/constants';
import { logApiRequest } from '../../src/utils/logger';

// API tests against JSONPlaceholder
test.use({ baseURL: API_BASE_URL });

test.describe('API Tests - JSONPlaceholder', () => {
  test.describe('GET Requests', () => {
    test('should get all posts', async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get('/posts');
      logApiRequest('GET', '/posts', response.status(), Date.now() - startTime);

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const posts = await response.json();
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    test('should get single post', async ({ request }) => {
      const response = await request.get('/posts/1');

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const post = await response.json();
      expect(post.id).toBe(1);
      expect(post.title).toBeTruthy();
      expect(post.body).toBeTruthy();
      expect(post.userId).toBeTruthy();
    });

    test('should get posts by user', async ({ request }) => {
      const response = await request.get('/posts?userId=1');

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const posts = await response.json();
      expect(posts.every((p: { userId: number }) => p.userId === 1)).toBe(true);
    });

    test('should get comments for post', async ({ request }) => {
      const response = await request.get('/posts/1/comments');

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const comments = await response.json();
      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0]).toHaveProperty('email');
      expect(comments[0]).toHaveProperty('body');
    });

    test('should get all users', async ({ request }) => {
      const response = await request.get('/users');

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const users = await response.json();
      expect(users.length).toBe(10);
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
    });
  });

  test.describe('POST Requests', () => {
    test('should create new post', async ({ request }) => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post body',
        userId: 1,
      };

      const response = await request.post('/posts', { data: newPost });

      expect(response.status()).toBe(HTTP_STATUS.CREATED);
      const post = await response.json();
      expect(post.id).toBeTruthy();
      expect(post.title).toBe(newPost.title);
      expect(post.body).toBe(newPost.body);
    });
  });

  test.describe('PUT Requests', () => {
    test('should update existing post', async ({ request }) => {
      const updatedPost = {
        id: 1,
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      };

      const response = await request.put('/posts/1', { data: updatedPost });

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const post = await response.json();
      expect(post.title).toBe(updatedPost.title);
    });
  });

  test.describe('PATCH Requests', () => {
    test('should partially update post', async ({ request }) => {
      const response = await request.patch('/posts/1', {
        data: { title: 'Patched Title' },
      });

      expect(response.status()).toBe(HTTP_STATUS.OK);
      const post = await response.json();
      expect(post.title).toBe('Patched Title');
    });
  });

  test.describe('DELETE Requests', () => {
    test('should delete post', async ({ request }) => {
      const response = await request.delete('/posts/1');

      expect(response.status()).toBe(HTTP_STATUS.OK);
    });
  });

  test.describe('Error Handling', () => {
    test('should return 404 for non-existent resource', async ({ request }) => {
      const response = await request.get('/posts/99999');

      expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
    });
  });

  test.describe('Response Headers', () => {
    test('should have correct content type', async ({ request }) => {
      const response = await request.get('/posts/1');
      const contentType = response.headers()['content-type'];

      expect(contentType).toContain('application/json');
    });
  });
});
