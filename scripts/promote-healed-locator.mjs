#!/usr/bin/env node
/**
 * Promote a cached heal winner into a locator file (manual review required).
 * Usage: node scripts/promote-healed-locator.mjs sauce.login.username placeholder-username
 */
import fs from 'node:fs';
import path from 'node:path';

const [, , locatorKey, winnerName] = process.argv;
if (!locatorKey || !winnerName) {
  console.error('Usage: promote-healed-locator.mjs <locatorKey> <winnerName>');
  process.exit(1);
}

const cacheFile = path.join(process.cwd(), process.env.AI_HEAL_CACHE_DIR || '.ai-heal-cache', 'heals.jsonl');
if (!fs.existsSync(cacheFile)) {
  console.error('No heal cache at', cacheFile);
  process.exit(1);
}

console.log(`Review locators/ and update primary selector for "${locatorKey}" to match strategy "${winnerName}".`);
console.log('Cache entry:', cacheFile);
console.log('Do not run unattended — open a PR after editing locators/*.ts');
