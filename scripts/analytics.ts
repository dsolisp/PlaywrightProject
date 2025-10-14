import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface TestResult {
  name: string;
  status: 'passed' | 'failed';
  duration: number;
  suite: string;
  timestamp: string;
}

interface AnalyticsSummary {
  totalTests: number;
  passed: number;
  failed: number;
  passRate: number;
  avgDuration: number;
  totalDuration: number;
  timestamp: string;
  environment: string;
  trends?: {
    previousPassRate?: number;
    change?: number;
  };
}

class TestAnalytics {
  private resultsDir = path.join(process.cwd(), 'data', 'results');
  private reportsDir = path.join(process.cwd(), 'reports');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.resultsDir, this.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async generateAnalytics() {
    console.log('🔍 Generating test analytics...');

    // Collect results from different sources
    const jestResults = this.parseJestResults();
    const playwrightResults = this.parsePlaywrightResults();
    const k6Results = this.parseK6Results();

    const allResults = [...jestResults, ...playwrightResults, ...k6Results];

    if (allResults.length === 0) {
      console.log('⚠️ No test results found to analyze.');
      return;
    }

    // Generate summary
    const summary = this.calculateSummary(allResults);

    // Add trends if previous data exists
    summary.trends = this.calculateTrends(summary);

    // Export in multiple formats
    this.exportJSON(summary, allResults);
    this.exportCSV(allResults);
    this.exportHTML(summary, allResults);

    console.log('✅ Analytics generated successfully!');
    console.log(`📊 Pass Rate: ${(summary.passRate * 100).toFixed(1)}%`);
    console.log(`⏱️ Average Duration: ${summary.avgDuration.toFixed(2)}ms`);
  }

  private parseJestResults(): TestResult[] {
    const results: TestResult[] = [];
    try {
      const jestOutputPath = path.join(this.resultsDir, 'jest-results.json');
      if (fs.existsSync(jestOutputPath)) {
        const data = JSON.parse(fs.readFileSync(jestOutputPath, 'utf8'));
        // Parse Jest JSON format
        data.testResults?.forEach((suite: any) => {
          suite.testResults?.forEach((test: any) => {
            results.push({
              name: test.title,
              status: test.status === 'passed' ? 'passed' : 'failed',
              duration: test.duration || 0,
              suite: suite.testFilePath,
              timestamp: new Date().toISOString(),
            });
          });
        });
      }
    } catch (error) {
      console.warn('⚠️ Could not parse Jest results:', error);
    }
    return results;
  }

  private parsePlaywrightResults(): TestResult[] {
    const results: TestResult[] = [];
    try {
      const playwrightResultsPath = path.join(this.resultsDir, 'playwright-results.json');
      if (fs.existsSync(playwrightResultsPath)) {
        const data = JSON.parse(fs.readFileSync(playwrightResultsPath, 'utf8'));
        // Parse Playwright JSON format
        data.suites?.forEach((suite: any) => {
          suite.specs?.forEach((spec: any) => {
            spec.tests?.forEach((test: any) => {
              results.push({
                name: test.title,
                status: test.results[0]?.status === 'passed' ? 'passed' : 'failed',
                duration: test.results[0]?.duration || 0,
                suite: suite.title,
                timestamp: new Date().toISOString(),
              });
            });
          });
        });
      }
    } catch (error) {
      console.warn('⚠️ Could not parse Playwright results:', error);
    }
    return results;
  }

  private parseK6Results(): TestResult[] {
    const results: TestResult[] = [];
    try {
      const k6ResultsPath = path.join(process.cwd(), 'k6-results.json');
      if (fs.existsSync(k6ResultsPath)) {
        const data = JSON.parse(fs.readFileSync(k6ResultsPath, 'utf8'));
        // Parse k6 summary format
        if (data.metrics) {
          const failedRate = data.metrics['http_req_failed']?.value || 0;
          const avgDuration = data.metrics['http_req_duration']?.avg || 0;
          results.push({
            name: 'k6 Performance Test',
            status: failedRate === 0 ? 'passed' : 'failed',
            duration: avgDuration,
            suite: 'performance',
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not parse k6 results:', error);
    }
    return results;
  }

  private calculateSummary(results: TestResult[]): AnalyticsSummary {
    const totalTests = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = totalTests - passed;
    const passRate = totalTests > 0 ? passed / totalTests : 0;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = totalTests > 0 ? totalDuration / totalTests : 0;

    return {
      totalTests,
      passed,
      failed,
      passRate,
      avgDuration,
      totalDuration,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private calculateTrends(current: AnalyticsSummary) {
    try {
      const historyPath = path.join(this.resultsDir, 'analytics-history.json');
      if (fs.existsSync(historyPath)) {
        const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        const previous = history[history.length - 1];
        if (previous) {
          const change = current.passRate - previous.passRate;
          return {
            previousPassRate: previous.passRate,
            change,
          };
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not calculate trends:', error);
    }
    return {};
  }

  private exportJSON(summary: AnalyticsSummary, results: TestResult[]) {
    const data = { summary, results };
    const filePath = path.join(this.reportsDir, 'analytics.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`📄 JSON report saved to: ${filePath}`);
  }

  private exportCSV(results: TestResult[]) {
    const csvHeader = 'Name,Status,Duration,Suite,Timestamp\n';
    const csvRows = results.map(r =>
      `"${r.name}","${r.status}",${r.duration},"${r.suite}","${r.timestamp}"`
    ).join('\n');
    const csvContent = csvHeader + csvRows;
    const filePath = path.join(this.reportsDir, 'analytics.csv');
    fs.writeFileSync(filePath, csvContent);
    console.log(`📊 CSV report saved to: ${filePath}`);
  }

  private exportHTML(summary: AnalyticsSummary, results: TestResult[]) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Analytics Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .metric { display: inline-block; margin: 10px; text-align: center; }
    .metric-value { font-size: 2em; font-weight: bold; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .passed { color: green; }
    .failed { color: red; }
  </style>
</head>
<body>
  <h1>Test Analytics Dashboard</h1>
  <div class="summary">
    <h2>Summary</h2>
    <div class="metric">
      <div class="metric-value">${summary.totalTests}</div>
      <div>Total Tests</div>
    </div>
    <div class="metric">
      <div class="metric-value">${summary.passed}</div>
      <div>Passed</div>
    </div>
    <div class="metric">
      <div class="metric-value">${summary.failed}</div>
      <div>Failed</div>
    </div>
    <div class="metric">
      <div class="metric-value">${(summary.passRate * 100).toFixed(1)}%</div>
      <div>Pass Rate</div>
    </div>
    <div class="metric">
      <div class="metric-value">${summary.avgDuration.toFixed(2)}ms</div>
      <div>Avg Duration</div>
    </div>
    ${summary.trends?.change !== undefined ? `
    <div class="metric">
      <div class="metric-value">${(summary.trends.change * 100).toFixed(1)}%</div>
      <div>Trend Change</div>
    </div>
    ` : ''}
  </div>
  <h2>Test Results</h2>
  <table>
    <thead>
      <tr>
        <th>Test Name</th>
        <th>Status</th>
        <th>Duration (ms)</th>
        <th>Suite</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      ${results.map(r => `
        <tr>
          <td>${r.name}</td>
          <td class="${r.status}">${r.status}</td>
          <td>${r.duration}</td>
          <td>${r.suite}</td>
          <td>${r.timestamp}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
    const filePath = path.join(this.reportsDir, 'analytics.html');
    fs.writeFileSync(filePath, html);
    console.log(`🌐 HTML dashboard saved to: ${filePath}`);
  }
}

// CLI runner
if (require.main === module) {
  const analytics = new TestAnalytics();
  analytics.generateAnalytics().catch(console.error);
}

export { TestAnalytics };