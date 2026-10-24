import { describe, expect, it, vi, beforeEach } from 'vitest';
import { resetAiSettingsForTests } from '../../config/ai-settings';
import { resetHealRunCounter } from '../../utils/healing-locator';

describe('healing-locator', () => {
  beforeEach(() => {
    resetAiSettingsForTests();
    resetHealRunCounter();
    vi.unstubAllEnvs();
  });

  it('exports resolveHealingLocator', async () => {
    const mod = await import('../../utils/healing-locator');
    expect(typeof mod.resolveHealingLocator).toBe('function');
  });

  it('aiSettings defaults healing off', async () => {
    // Product default is off. Nightly/CI may set AI_HEALING_ENABLED=true at
    // job level (ADR-019) — clear real env so this asserts the default, not
    // the ambient runner config. vi.unstubAllEnvs() does not delete real env.
    delete process.env.AI_HEALING_ENABLED;
    delete process.env.AI_TRIAGE_ENABLED;
    resetAiSettingsForTests();
    const { aiSettings } = await import('../../config/ai-settings');
    expect(aiSettings().healingEnabled).toBe(false);
  });
});
