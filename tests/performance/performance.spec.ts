import { test, expect } from '@playwright/test';
import { settings } from '../../src/config/settings';

/**
 * Performance Tests
 * Equivalent to Python's tests/performance/test_performance.py
 */

test.describe('Performance Tests', () => {
  test.describe('Page Load Performance', () => {
    test('homepage should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(settings().baseUrl);
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;
      console.info(`Homepage load time: ${loadTime}ms`);

      // Should load within 10 seconds (external sites may be slower)
      expect(loadTime).toBeLessThan(10000);
    });

    test('SauceDemo login page should load quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(settings().sauceDemoUrl);
      await page.waitForLoadState('domcontentloaded');

      const loadTime = Date.now() - startTime;
      console.info(`SauceDemo load time: ${loadTime}ms`);

      expect(loadTime).toBeLessThan(3000);
    });
  });

  test.describe('Core Web Vitals', () => {
    test('should measure Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      // Get LCP using Performance API
      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // Fallback timeout
          setTimeout(() => resolve(-1), 5000);
        });
      });

      console.info(`LCP: ${lcp}ms`);

      // LCP should be under 2.5 seconds (Good)
      if (lcp > 0) {
        expect(lcp).toBeLessThan(2500);
      }
    });

    test('should measure First Contentful Paint (FCP)', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      const fcp = await page.evaluate(() => {
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');
        return fcpEntry?.startTime ?? -1;
      });

      console.info(`FCP: ${fcp}ms`);

      // FCP should be under 1.8 seconds (Good)
      if (fcp > 0) {
        expect(fcp).toBeLessThan(1800);
      }
    });

    test('should measure Time to Interactive approximation', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(settings().sauceDemoUrl);
      await page.waitForLoadState('networkidle');

      // Wait for interactive elements
      await page.waitForSelector('#login-button');
      await page.locator('#login-button').isEnabled();

      const tti = Date.now() - startTime;
      console.info(`Time to Interactive (approx): ${tti}ms`);

      expect(tti).toBeLessThan(5000);
    });
  });

  test.describe('API Performance', () => {
    test('API responses should be fast', async ({ request }) => {
      const startTime = Date.now();

      const response = await request.get('https://jsonplaceholder.typicode.com/posts');

      const responseTime = Date.now() - startTime;
      console.info(`API response time: ${responseTime}ms`);

      expect(response.status()).toBe(200);
      expect(responseTime).toBeLessThan(2000);
    });

    test('concurrent API requests should be fast', async ({ request }) => {
      const startTime = Date.now();

      // Make 5 concurrent requests
      const promises = [
        request.get('https://jsonplaceholder.typicode.com/posts/1'),
        request.get('https://jsonplaceholder.typicode.com/posts/2'),
        request.get('https://jsonplaceholder.typicode.com/posts/3'),
        request.get('https://jsonplaceholder.typicode.com/users/1'),
        request.get('https://jsonplaceholder.typicode.com/comments?postId=1'),
      ];

      const responses = await Promise.all(promises);

      const totalTime = Date.now() - startTime;
      console.info(`Concurrent requests time: ${totalTime}ms`);

      // All should succeed
      responses.forEach((r) => expect(r.status()).toBe(200));

      // Should complete within 3 seconds (concurrent)
      expect(totalTime).toBeLessThan(3000);
    });
  });

  test.describe('Resource Loading', () => {
    test('should not have excessive resource size', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      const resourceSizes = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return resources.map((r) => ({
          name: r.name.split('/').pop(),
          size: r.transferSize,
          type: r.initiatorType,
        }));
      });

      const totalSize = resourceSizes.reduce((sum, r) => sum + (r.size || 0), 0);
      const totalSizeKB = Math.round(totalSize / 1024);
      console.info(`Total resource size: ${totalSizeKB}KB`);

      // Should be under 2MB
      expect(totalSize).toBeLessThan(2 * 1024 * 1024);
    });
  });
});
