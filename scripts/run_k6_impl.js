/* eslint-env node */
/* eslint-disable no-undef */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function metricValue(metric, key) {
  if (!metric) return undefined;
  if (metric[key] !== undefined) return metric[key];
  if (metric.values && metric.values[key] !== undefined) return metric.values[key];
  return undefined;
}

function parseSummary(outPath) {
  if (!fs.existsSync(outPath)) {
    const err = new Error(`k6 summary not found at ${outPath}`);
    err.code = 'NO_SUMMARY';
    throw err;
  }
  const summary = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const metrics = summary.metrics || {};

  let p95 = metricValue(metrics['http_req_duration'], 'p(95)');
  if (p95 === undefined)
    p95 = metricValue(metrics['http_req_duration{expected_response:true}'], 'p(95)');

  let failed = undefined;
  if (metrics['http_req_failed']) {
    failed = metrics['http_req_failed'].value ?? metricValue(metrics['http_req_failed'], 'rate');
  }
  if ((failed === undefined || failed === null) && metrics['http_req_failed{type:search}']) {
    failed =
      metrics['http_req_failed{type:search}'].value ??
      metricValue(metrics['http_req_failed{type:search}'], 'rate');
  }
  if ((failed === undefined || failed === null) && metrics.checks) {
    const c = metrics.checks;
    if (typeof c.passes === 'number' && typeof c.fails === 'number') {
      failed = c.fails / (c.passes + c.fails);
    } else if (typeof c.value === 'number') {
      failed = 1 - c.value;
    }
  }
  if (failed === undefined || failed === null) failed = 0;

  return { summary, p95, failed, metrics };
}

function loadConfig() {
  const configPath = path.join(process.cwd(), 'k6-config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`k6 config not found at ${configPath}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function runK6(options = {}) {
  const out = path.join(process.cwd(), options.out || 'k6-results.json');
  const args = ['run', '--summary-export', out, 'k6/search_engine.k6.js'];
  if (options.short) args.unshift('--env', 'K6_SHORT=1');

  // run k6 synchronously and capture output
  const res = spawnSync('k6', args, { stdio: 'inherit' });
  if (res.error) {
    const err = new Error('Failed to run k6');
    err.cause = res.error;
    throw err;
  }
  if (res.status !== 0) {
    const err = new Error(`k6 exited with non-zero status ${res.status}`);
    err.code = 'K6_EXIT';
    err.status = res.status;
    throw err;
  }

  return parseSummary(out);
}

module.exports = {
  runK6,
  parseSummary,
  loadConfig,
};

// CLI compatibility: when invoked directly, exit with codes
if (require.main === module) {
  try {
    const config = loadConfig();
    const isShort = process.env.K6_SHORT === '1' || process.env.K6_SHORT === 'true';
    const thresholds = isShort ? config.short : config.full;
    const result = runK6({ short: isShort, out: 'k6-results.json' });
    const { p95, failed } = result;
    console.log('k6 summary p95:', p95, 'failed rate:', failed);
    if (p95 > thresholds.p95 || failed > thresholds.failed) {
      console.error(
        `k6 thresholds exceeded (p95:${p95} > ${thresholds.p95} or failed:${failed} > ${thresholds.failed})`,
      );
      process.exit(3);
    }
    console.log('k6 checks passed');
    process.exit(0);
  } catch (err) {
    console.error(err && err.message ? err.message : err);
    process.exit(2);
  }
}
