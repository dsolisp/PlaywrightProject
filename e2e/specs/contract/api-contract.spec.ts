import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../../../lib/config/constants';

// Contract tests - make sure the API returns what we expect.
// Think of these as lightweight Pact tests: we're validating response shapes,
// not business logic.

test.use({ baseURL: API_BASE_URL });

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

test.describe('API Contract Tests', () => {
  test.describe('Posts Contract', () => {
    test('GET /posts should match Post schema', async ({ request }) => {
      const response = await request.get('/posts');
      expect(response.status()).toBe(200);

      const posts = (await response.json()) as Post[];

      // Verify array
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);

      // Verify first post structure
      const post = posts[0];
      expect(typeof post.id).toBe('number');
      expect(typeof post.userId).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
    });

    test('GET /posts/:id should match Post schema', async ({ request }) => {
      const response = await request.get('/posts/1');
      expect(response.status()).toBe(200);

      const post = (await response.json()) as Post;

      expect(post.id).toBe(1);
      expect(typeof post.userId).toBe('number');
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
    });

    test('POST /posts should return created Post', async ({ request }) => {
      const newPost = {
        title: 'Test Post',
        body: 'Test body',
        userId: 1,
      };

      const response = await request.post('/posts', { data: newPost });
      expect(response.status()).toBe(201);

      const post = (await response.json()) as Post;

      expect(typeof post.id).toBe('number');
      expect(post.title).toBe(newPost.title);
      expect(post.body).toBe(newPost.body);
      expect(post.userId).toBe(newPost.userId);
    });
  });

  test.describe('Users Contract', () => {
    test('GET /users should match User schema', async ({ request }) => {
      const response = await request.get('/users');
      expect(response.status()).toBe(200);

      const users = (await response.json()) as User[];

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(10);

      const user = users[0];
      expect(typeof user.id).toBe('number');
      expect(typeof user.name).toBe('string');
      expect(typeof user.username).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.address).toBe('object');
      expect(typeof user.address.street).toBe('string');
      expect(typeof user.address.geo).toBe('object');
      expect(typeof user.phone).toBe('string');
      expect(typeof user.company).toBe('object');
    });

    test('GET /users/:id should match User schema', async ({ request }) => {
      const response = await request.get('/users/1');
      expect(response.status()).toBe(200);

      const user = (await response.json()) as User;

      expect(user.id).toBe(1);
      expect(user.address).toBeDefined();
      expect(user.address.geo).toBeDefined();
      expect(user.company).toBeDefined();
    });
  });

  test.describe('Comments Contract', () => {
    test('GET /comments should match Comment schema', async ({ request }) => {
      const response = await request.get('/comments');
      expect(response.status()).toBe(200);

      const comments = (await response.json()) as Comment[];

      const comment = comments[0];
      expect(typeof comment.id).toBe('number');
      expect(typeof comment.postId).toBe('number');
      expect(typeof comment.name).toBe('string');
      expect(typeof comment.email).toBe('string');
      expect(typeof comment.body).toBe('string');
    });

    test('GET /posts/:id/comments should match Comment schema', async ({ request }) => {
      const response = await request.get('/posts/1/comments');
      expect(response.status()).toBe(200);

      const comments = (await response.json()) as Comment[];

      expect(comments.every((c) => c.postId === 1)).toBe(true);
    });
  });

  test.describe('Error Responses Contract', () => {
    test('GET /posts/99999 should return 404', async ({ request }) => {
      const response = await request.get('/posts/99999');
      expect(response.status()).toBe(404);
    });
  });
});
