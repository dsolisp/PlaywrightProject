import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
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
    const diffPixels = pixelmatch(baselineImg.data, currentImg.data, diff.data, width, height, {
      threshold: 0.1,
    });

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
