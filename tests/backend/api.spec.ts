import { test, expect } from '@playwright/test';
import { URLS } from '../../config/constants';

// SWAPI — Comprehensive API Tests
// Pure request tests — no page objects needed for API specs.
// Covers: positive, negative, schema validation, SLA, and pagination.

interface SwapiListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface SwapiPerson {
  name: string;
  height: string;
  gender: string;
}

interface SwapiStarship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

test.describe('SWAPI — Comprehensive API Tests @api', () => {
  const BASE_URL = URLS.SWAPI;

  // ── Positive Tests ──────────────────────────────────────────────────
  test('Example 1: Fetches a specific person (Luke Skywalker)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people/1`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('name');
    expect(body.name).toBe('Luke Skywalker');
    expect(body.height).toBe('172');
  });

  test('Example 2: Fetches a paginated collection of people', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as SwapiListResponse<SwapiPerson>;
    expect(body.count).toBeGreaterThan(0);
    expect(body.next).not.toBeNull();
    expect(body.previous).toBeNull();
    expect(body.results[0]).toHaveProperty('name');
    expect(body.results[0]).toHaveProperty('gender');
  });

  test('Example 3: Fetches a person using search query', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people?search=Darth Vader`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as SwapiListResponse<SwapiPerson>;
    expect(body.count).toBe(1);
    expect(body.results[0].name).toBe('Darth Vader');
  });

  // ── Schema Validation ───────────────────────────────────────────────
  test('Example 4: Validates starship resource schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/starships/9`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as SwapiStarship;
    const expectedKeys = [
      'name',
      'model',
      'manufacturer',
      'cost_in_credits',
      'length',
      'max_atmosphering_speed',
      'crew',
      'passengers',
      'cargo_capacity',
      'consumables',
      'hyperdrive_rating',
      'MGLT',
      'starship_class',
      'pilots',
      'films',
      'created',
      'edited',
      'url',
    ];
    for (const key of expectedKeys) {
      expect(body).toHaveProperty(key);
    }
  });

  // ── SLA / Performance ───────────────────────────────────────────────
  test('Example 5: Verifies response time is under 3000ms (external API)', async ({ request }) => {
    const start = Date.now();
    await request.get(`${BASE_URL}/planets/1`);
    expect(Date.now() - start).toBeLessThan(3000);
  });

  // ── Negative Tests ──────────────────────────────────────────────────
  test('Example 6: Verifies 404 for non-existent resource ID', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people/99999`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.detail).toBe('Not found');
  });

  test('Example 7: Verifies 404 for invalid endpoint', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/invalid_endpoint`);
    expect(response.status()).toBe(404);
  });

  test('Example 8: Handles search with no matches', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people?search=xyz_no_match`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as SwapiListResponse<SwapiPerson>;
    expect(body.count).toBe(0);
    expect(body.results.length).toBe(0);
  });

  // ── Pagination Boundary ─────────────────────────────────────────────
  test('Example 9: Verifies first page has no previous link', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people?page=1`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as SwapiListResponse<SwapiPerson>;
    expect(body.previous).toBeNull();
    expect(body.next).not.toBeNull();
  });

  test('Example 10: Verifies last page has no next link', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/people`);
    const body = (await response.json()) as SwapiListResponse<SwapiPerson>;
    const totalPages = Math.ceil(body.count / body.results.length);

    const lastPage = await request.get(`${BASE_URL}/people?page=${totalPages}`);
    expect(lastPage.status()).toBe(200);
    const lastBody = (await lastPage.json()) as SwapiListResponse<SwapiPerson>;
    expect(lastBody.next).toBeNull();
  });
});
