import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { settings } from '../../../lib/config/settings';

/**
 * Lighthouse-Style Accessibility Audits
 * Uses Axe-core with Lighthouse-like scoring methodology
 * Provides comprehensive accessibility audits similar to Google Lighthouse
 */

interface AccessibilityScore {
  score: number;
  passes: number;
  violations: number;
  incomplete: number;
  inapplicable: number;
  criticalViolations: number;
  seriousViolations: number;
}

/**
 * Calculate a Lighthouse-style accessibility score from Axe results
 * Lighthouse uses a weighted scoring system based on impact
 */
function calculateAccessibilityScore(
  results: Awaited<ReturnType<AxeBuilder['analyze']>>,
): AccessibilityScore {
  const criticalViolations = results.violations.filter((v) => v.impact === 'critical').length;
  const seriousViolations = results.violations.filter((v) => v.impact === 'serious').length;
  const moderateViolations = results.violations.filter((v) => v.impact === 'moderate').length;
  const minorViolations = results.violations.filter((v) => v.impact === 'minor').length;

  // Weighted penalty: critical=10, serious=5, moderate=2, minor=1
  const penalty =
    criticalViolations * 10 + seriousViolations * 5 + moderateViolations * 2 + minorViolations;
  const maxPenalty = 50; // Cap penalty at 50 points
  const score = Math.max(0, 100 - Math.min(penalty, maxPenalty));

  return {
    score,
    passes: results.passes.length,
    violations: results.violations.length,
    incomplete: results.incomplete.length,
    inapplicable: results.inapplicable.length,
    criticalViolations,
    seriousViolations,
  };
}

test.describe('Lighthouse-Style Accessibility Audits', () => {
  test('should have good accessibility score on Bing homepage', async ({ page }) => {
    await page.goto(settings().baseUrl);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const scoreData = calculateAccessibilityScore(results);

    console.info(`\n=== Lighthouse-Style Accessibility Audit ===`);
    console.info(`Bing Homepage Score: ${scoreData.score}%`);
    console.info(`Passes: ${scoreData.passes}, Violations: ${scoreData.violations}`);
    console.info(
      `Critical: ${scoreData.criticalViolations}, Serious: ${scoreData.seriousViolations}`,
    );

    if (results.violations.length > 0) {
      console.info(`\nTop Violations:`);
      for (const v of results.violations.slice(0, 5)) {
        console.info(`  [${v.impact}] ${v.id}: ${v.description}`);
      }
    }

    // Expect at least 70% accessibility score
    expect(scoreData.score).toBeGreaterThanOrEqual(70);
  });

  test('should have good accessibility score on SauceDemo login', async ({ page }) => {
    await page.goto(settings().sauceDemoUrl);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const scoreData = calculateAccessibilityScore(results);

    console.info(`\n=== SauceDemo Lighthouse-Style Accessibility ===`);
    console.info(`Login Page Score: ${scoreData.score}%`);
    console.info(`Passes: ${scoreData.passes}, Violations: ${scoreData.violations}`);

    // SauceDemo is a demo site, expect at least 60%
    expect(scoreData.score).toBeGreaterThanOrEqual(60);
  });

  test('should report accessibility issues in detail', async ({ page }) => {
    await page.goto(settings().baseUrl);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const scoreData = calculateAccessibilityScore(results);

    // Check specific accessibility categories
    const ariaViolations = results.violations.filter((v) => v.id.startsWith('aria'));
    const colorViolations = results.violations.filter((v) => v.id.includes('color'));
    const imageViolations = results.violations.filter(
      (v) => v.id.includes('image') || v.id.includes('alt'),
    );

    console.info(`\n=== Detailed Accessibility Report ===`);
    console.info(`Overall Score: ${scoreData.score}%`);
    console.info(`ARIA issues: ${ariaViolations.length}`);
    console.info(`Color contrast issues: ${colorViolations.length}`);
    console.info(`Image/alt issues: ${imageViolations.length}`);

    // Verify we got audit results
    expect(scoreData.passes + scoreData.violations + scoreData.incomplete).toBeGreaterThan(0);
  });

  test('should have no critical accessibility violations', async ({ page }) => {
    await page.goto(settings().baseUrl);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const scoreData = calculateAccessibilityScore(results);

    console.info(`\n=== Critical Violations Check ===`);
    console.info(
      `Critical: ${scoreData.criticalViolations}, Serious: ${scoreData.seriousViolations}`,
    );

    // No critical violations allowed
    expect(scoreData.criticalViolations).toBe(0);
  });
});
