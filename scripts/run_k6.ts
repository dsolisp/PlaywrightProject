/* eslint-disable */
/* eslint-env node */
import path from 'path';

type K6Result = { summary: unknown; p95: number; failed: number; metrics: unknown };

export async function runK6(options?: { short?: boolean; out?: string }): Promise<K6Result> {
  // dynamic import to satisfy ESM/require mixing in projects
  // @ts-ignore
  const jsModule = (await import('./run_k6_impl.js')) as any;
  return jsModule.runK6(options);
}

export function parseSummary(outPath: string): K6Result {
  const jsModule = require('./run_k6_impl.js');
  return jsModule.parseSummary(path.join(process.cwd(), outPath));
}

export default runK6;
