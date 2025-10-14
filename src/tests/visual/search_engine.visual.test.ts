import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const FIXTURE_HTML = path.join(__dirname, '..', 'fixtures', 'duckduckgo_html_results.html');
const BASELINE_DIR = path.join(__dirname, '..', 'visual');
const BASELINE_PATH = path.join(BASELINE_DIR, 'duckduckgo_baseline.png');
const DIFF_PATH = path.join('test-results', 'visual-diff.png');

describe('visual: search engine snapshot', () => {
  test('renders fixture and matches baseline', async () => {
    const html = fs.readFileSync(FIXTURE_HTML, 'utf8');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();

    // Render the fixture HTML directly so the test is deterministic
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForSelector('body');

    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    // Ensure baseline directory exists
    if (!fs.existsSync(BASELINE_DIR)) fs.mkdirSync(BASELINE_DIR, { recursive: true });
    // If no baseline exists, write one and pass the test (first-run friendly)
    if (!fs.existsSync(BASELINE_PATH)) {
      fs.writeFileSync(BASELINE_PATH, screenshot);
      console.log(`Baseline created at ${BASELINE_PATH}`);
      return;
    }

    // Load baseline and current screenshot as PNGs
    const baselineImg = PNG.sync.read(fs.readFileSync(BASELINE_PATH));
    const currentImg = PNG.sync.read(screenshot);

    // If sizes differ, fail clearly
    if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
      fs.writeFileSync(DIFF_PATH, screenshot);
      throw new Error(
        `Baseline and current screenshot dimensions differ (${baselineImg.width}x${baselineImg.height} vs ${currentImg.width}x${currentImg.height}). Diff saved to ${DIFF_PATH}`,
      );
    }

    const { width, height } = baselineImg;
    const diff = new PNG({ width, height });
    // Lightweight pixel comparison (avoids ESM-only pixelmatch in Jest).
    // We compare pixels using a simple per-pixel color distance and count
    // pixels that exceed the threshold.
    const diffPixels = (() => {
      const dataA = baselineImg.data;
      const dataB = currentImg.data;
      const w = width;
      const h = height;
      let diffs = 0;
      const threshold = 0.12; // per-pixel distance threshold (0..1)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r1 = dataA[idx];
          const g1 = dataA[idx + 1];
          const b1 = dataA[idx + 2];
          const a1 = dataA[idx + 3];
          const r2 = dataB[idx];
          const g2 = dataB[idx + 1];
          const b2 = dataB[idx + 2];
          const a2 = dataB[idx + 3];

          // If both pixels are fully transparent, consider them equal
          if (a1 === 0 && a2 === 0) continue;

          const dr = (r1 - r2) / 255;
          const dg = (g1 - g2) / 255;
          const db = (b1 - b2) / 255;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db) / Math.sqrt(3);
          if (dist > threshold) {
            diffs++;
            // write a visible marker into diff image (red)
            diff.data[idx] = 255;
            diff.data[idx + 1] = 0;
            diff.data[idx + 2] = 0;
            diff.data[idx + 3] = 255;
          } else {
            // copy a blended pixel (light gray) for context
            const v = 240;
            diff.data[idx] = v;
            diff.data[idx + 1] = v;
            diff.data[idx + 2] = v;
            diff.data[idx + 3] = 255;
          }
        }
      }
      return diffs;
    })();

    // Ensure output directory exists
    if (!fs.existsSync('test-results')) fs.mkdirSync('test-results', { recursive: true });
    fs.writeFileSync(DIFF_PATH, PNG.sync.write(diff));

    const totalPixels = width * height;
    const percentDiff = (diffPixels / totalPixels) * 100;

    // Allow tiny noise; fail if more than 0.5% of pixels differ
    const thresholdPercent = 0.5;
    expect(percentDiff).toBeLessThanOrEqual(thresholdPercent);
  }, 30_000);
});
