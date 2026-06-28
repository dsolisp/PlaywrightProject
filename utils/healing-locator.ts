import fs from 'node:fs';
import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { aiSettings } from '../config/ai-settings';
import { logger } from './logger';

export type LocatorFallback = {
  name: string;
  build: (page: Page) => Locator;
};

type HealCacheEntry = {
  locatorKey: string;
  winner: string;
  at: string;
};

let healsThisRun = 0;

/**
 * Resolve a locator with heuristic fallbacks, optional AI heal (ADR-019).
 * Used from locators/pages — never from specs (Law 3).
 */
export async function resolveHealingLocator(
  page: Page,
  locatorKey: string,
  primary: Locator,
  fallbacks: LocatorFallback[],
): Promise<Locator> {
  if (await primary.count()) {
    return primary;
  }

  for (const fb of fallbacks) {
    const candidate = fb.build(page);
    if (await candidate.count()) {
      await recordHeal(locatorKey, fb.name);
      logger.info(`Heuristic locator heal applied: ${locatorKey} → ${fb.name}`);
      return candidate;
    }
  }

  const settings = aiSettings();
  if (settings.healingEnabled && healsThisRun < settings.maxHealsPerRun) {
    const cached = readCache(locatorKey);
    if (cached) {
      const fb = fallbacks.find((f) => f.name === cached);
      if (fb) {
        const candidate = fb.build(page);
        if (await candidate.count()) {
          healsThisRun++;
          return candidate;
        }
      }
    }
    // Optional: integrate healwright / autoheal-locator-js when installed (see docs/ai/README.md)
    logger.warn(`AI heal libraries not wired for ${locatorKey}; install healwright for LLM fallback`);
  }

  return primary;
}

async function recordHeal(locatorKey: string, winner: string): Promise<void> {
  healsThisRun++;
  const dir = path.resolve(aiSettings().cacheDir);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'heals.jsonl');
  const entry: HealCacheEntry = { locatorKey, winner, at: new Date().toISOString() };
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`);
}

function readCache(locatorKey: string): string | null {
  const file = path.join(path.resolve(aiSettings().cacheDir), 'heals.jsonl');
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const row = JSON.parse(lines[i]!) as HealCacheEntry;
    if (row.locatorKey === locatorKey) return row.winner;
  }
  return null;
}

export function resetHealRunCounter(): void {
  healsThisRun = 0;
}
