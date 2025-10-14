/* eslint-env node, jest */
import runK6 from '../../../scripts/run_k6';

jest.setTimeout(120000); // allow k6 to run

describe('k6 performance smoke', () => {
  it('runs a short k6 script and meets basic thresholds', async () => {
    const result = await runK6({ short: true, out: 'k6-results.json' });
    // basic assertions
    expect(result).toBeDefined();
    expect(typeof result.p95).toBe('number');
    expect(typeof result.failed).toBe('number');

    // thresholds from config (short mode)
    expect(result.p95).toBeLessThanOrEqual(1000);
    expect(result.failed).toBeLessThanOrEqual(0.1);
  });
});
