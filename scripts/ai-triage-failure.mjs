#!/usr/bin/env node
/**
 * Summarize latest Allure/Playwright failure via Ollama (OSS-first, ADR-019).
 * Usage: AI_TRIAGE_ENABLED=true node scripts/ai-triage-failure.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const resultsFile = path.join(process.cwd(), 'data/results/playwright-results.json');

if (process.env.AI_TRIAGE_ENABLED !== 'true') {
  console.log('AI_TRIAGE_ENABLED is not true; skipping triage.');
  process.exit(0);
}

let snippet = 'No playwright-results.json found.';
if (fs.existsSync(resultsFile)) {
  const raw = fs.readFileSync(resultsFile, 'utf8');
  snippet = raw.slice(0, 8000);
}

const prompt = `Summarize this test failure for a QA engineer in 5 bullets:\n${snippet}`;

const res = await fetch(`${base}/api/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ model, prompt, stream: false }),
});

if (!res.ok) {
  console.error('Ollama request failed', res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const outDir = path.join(process.cwd(), 'data/results');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'ai-triage.md');
fs.writeFileSync(outFile, `# AI triage\n\n${data.response || JSON.stringify(data)}\n`);
console.log('Wrote', outFile);
