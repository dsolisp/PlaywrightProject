/**
 * Placeholder when FLAKE_DETECTIVE_ENABLED=true.
 * Install flakiness-detective-ts and replace with its Playwright reporter (see docs/ai/flaky-and-triage.md).
 */
import type { Reporter } from '@playwright/test/reporter';

const reporter: Reporter = {
  onBegin() {
    console.warn(
      '[flaky-reporter] Install flakiness-detective-ts for full reporter; stub active (ADR-019).',
    );
  },
};

export default reporter;
