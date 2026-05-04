import { test, expect } from '@playwright/test';
import { URLS } from '../../config/constants';

// API Contract Tests
// Validates API schemas and contract stability using JSON Schema validation.
// Mirror of Cypress contract.cy.ts

test.describe('API Contract Tests @api @contract', () => {
  const SWAPI_BASE = URLS.SWAPI;

  test('should match expected schema for /people endpoint', async ({ request }) => {
    const response = await request.get(`${SWAPI_BASE}/people/1/`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('height');
    expect(body).toHaveProperty('mass');
    expect(body).toHaveProperty('hair_color');
    expect(body).toHaveProperty('skin_color');
    expect(body).toHaveProperty('eye_color');
    expect(body).toHaveProperty('birth_year');
    expect(body).toHaveProperty('gender');
    expect(body).toHaveProperty('homeworld');
    expect(body).toHaveProperty('films');
    expect(body).toHaveProperty('species');
    expect(body).toHaveProperty('vehicles');
    expect(body).toHaveProperty('starships');
    expect(body).toHaveProperty('created');
    expect(body).toHaveProperty('edited');
    expect(body).toHaveProperty('url');
  });

  test('should validate films endpoint contract', async ({ request }) => {
    const response = await request.get(`${SWAPI_BASE}/films/1/`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('episode_id');
    expect(body).toHaveProperty('opening_crawl');
    expect(body).toHaveProperty('director');
    expect(body).toHaveProperty('producer');
    expect(body).toHaveProperty('release_date');
    expect(Array.isArray(body.characters)).toBe(true);
    expect(Array.isArray(body.planets)).toBe(true);
    expect(Array.isArray(body.starships)).toBe(true);
    expect(Array.isArray(body.vehicles)).toBe(true);
    expect(Array.isArray(body.species)).toBe(true);
    expect(body).toHaveProperty('created');
    expect(body).toHaveProperty('edited');
    expect(body).toHaveProperty('url');
  });

  test('should validate planets endpoint contract', async ({ request }) => {
    const response = await request.get(`${SWAPI_BASE}/planets/1/`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('rotation_period');
    expect(body).toHaveProperty('orbital_period');
    expect(body).toHaveProperty('diameter');
    expect(body).toHaveProperty('climate');
    expect(body).toHaveProperty('gravity');
    expect(body).toHaveProperty('terrain');
    expect(body).toHaveProperty('surface_water');
    expect(body).toHaveProperty('population');
    expect(Array.isArray(body.residents)).toBe(true);
    expect(Array.isArray(body.films)).toBe(true);
  });

  test('should ensure contract stability — no unexpected fields removed', async ({ request }) => {
    const response = await request.get(`${SWAPI_BASE}/people/1/`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    const requiredFields = [
      'name', 'height', 'mass', 'hair_color', 'skin_color',
      'eye_color', 'birth_year', 'gender'
    ];
    for (const field of requiredFields) {
      expect(body).toHaveProperty(field);
    }
  });

  test('should validate array response structure for list endpoints', async ({ request }) => {
    const response = await request.get(`${SWAPI_BASE}/people/`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.count).toBe('number');
    expect(body).toHaveProperty('next');
    expect(body).toHaveProperty('previous');
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results[0]).toHaveProperty('name');
    expect(body.results[0]).toHaveProperty('height');
  });
});
