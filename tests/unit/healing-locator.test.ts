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
    const { aiSettings } = await import('../../config/ai-settings');
    expect(aiSettings().healingEnabled).toBe(false);
  });
});
