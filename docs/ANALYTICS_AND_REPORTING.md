# Analytics and Reporting

Comprehensive analytics and reporting system for test results, powered by Allure, k6, and custom analytics scripts.

## Overview

Analytics and reporting are now fully automated as part of the unified workflow. The framework generates rich Allure reports, k6 performance summaries, and custom analytics dashboards with pass rates, trends, and detailed breakdowns.

## 🎯 When to Use

• After running the workflow script: All analytics and reports are generated automatically
• Test result analysis: Detailed pass/fail rates, durations, and trends
• Performance monitoring: k6 results integration
• CI/CD reporting: Automated artifact uploads
• Historical tracking: Trend analysis across test runs

## 🔧 Key Components

### 1. Allure Reporting (Automated)

Purpose: Rich HTML reports for E2E and API tests with steps, attachments, and environment info

Features:
• Custom test steps and attachments
• Environment parameters (browser, CI, environment)
• Screenshots and logs
• Hierarchical test organization (epic/feature/story)

### 2. k6 Performance Analytics

Purpose: Performance test results with thresholds and summaries

Features:
• JSON summaries with metrics
• Threshold validation
• CI artifact uploads

### 3. Custom Analytics Script (`scripts/analytics.ts`)

Purpose: Unified analytics across all test types

Features:
• Aggregates Jest, Playwright, and k6 results
• Generates JSON, CSV, and HTML reports
• Trend analysis (pass rate changes)
• Dashboard generation

## 📊 Analytics Workflow

### Automated Generation

```bash
# Run all tests and generate analytics
npm test
npm run analytics
```

### Manual Analytics

```bash
# Generate analytics from existing results
npm run analytics
```

## 📈 Report Formats

### JSON Report (`reports/analytics.json`)

```json
{
  "summary": {
    "totalTests": 25,
    "passed": 23,
    "failed": 2,
    "passRate": 0.92,
    "avgDuration": 245.5,
    "totalDuration": 6137.5,
    "timestamp": "2025-10-14T12:00:00.000Z",
    "environment": "development",
    "trends": {
      "previousPassRate": 0.88,
      "change": 0.04
    }
  },
  "results": [...]
}
```

### CSV Report (`reports/analytics.csv`)

```
Name,Status,Duration,Suite,Timestamp
"duckduckgo: basic search returns results","passed",1250,"Search Engine E2E","2025-10-14T12:00:00.000Z"
...
```

### HTML Dashboard (`reports/analytics.html`)

Interactive dashboard with:
• Summary metrics (pass rate, durations)
• Trend indicators
• Detailed test results table
• Color-coded status

## 🚀 CI/CD Integration

### GitHub Actions

Analytics are automatically generated in CI:

```yaml
- name: Generate analytics
  run: npm run analytics
- name: Upload analytics reports
  uses: actions/upload-artifact@v4
  with:
    name: analytics-reports
    path: reports/
```

### Artifact Downloads

After CI runs, download artifacts:
• `allure-results/` - Allure raw data
• `k6-results/` - Performance summaries
• `analytics-reports/` - JSON/CSV/HTML analytics

## 🎨 Allure Enhancements

### Custom Steps and Attachments

```typescript
import { allure } from 'allure-playwright';

test('example test', async ({ page }) => {
  await allure.epic('Search Engine Automation');
  await allure.feature('Basic Search');
  await allure.story('DuckDuckGo Search Results');

  await allure.step('Navigate to search engine', async () => {
    await page.goto('https://duckduckgo.com');
  });

  // Add attachments
  const screenshot = await page.screenshot();
  allure.attachment('Screenshot', screenshot, 'image/png');
});
```

### Environment Info

```typescript
test.beforeEach(async ({ page }) => {
  allure.parameter('Browser', page.context().browser()?.browserType().name());
  allure.parameter('Environment', process.env.NODE_ENV || 'development');
  allure.parameter('CI', process.env.CI || 'false');
});
```

## 📊 k6 Analytics

### Result Structure

k6 results are parsed from `k6-results.json`:

```json
{
  "metrics": {
    "http_req_duration": {
      "values": {
        "avg": 245.5,
        "p95": 890.0
      }
    },
    "http_req_failed": {
      "values": {
        "rate": 0.02
      }
    }
  }
}
```

### Threshold Validation

Configured in `k6-config.json`:

```json
{
  "thresholds": {
    "http_req_duration": ["p(95)<1000"],
    "http_req_failed": ["rate<0.05"]
  }
}
```

## 📈 Trend Analysis

### Historical Tracking

Analytics script maintains history in `data/results/analytics-history.json`:

```json
[
  {
    "timestamp": "2025-10-13T12:00:00.000Z",
    "passRate": 0.88
  },
  {
    "timestamp": "2025-10-14T12:00:00.000Z",
    "passRate": 0.92
  }
]
```

### Change Detection

Reports show:
• Previous pass rate
• Change percentage
• Trend indicators

## 💡 Best Practices

1. Run analytics after every test execution
2. Review Allure reports for failed tests
3. Monitor performance trends in k6 results
4. Use HTML dashboard for quick overviews
5. Archive analytics for historical analysis
6. Set up alerts for significant pass rate drops

## 📚 Related Documentation

• [Performance Monitoring](PERFORMANCE_MONITORING.md) - k6 integration details
• [CI/CD Guide](https://github.com/dsolisp/PythonSeleniumProject/blob/main/documentation/LOCAL_DEV_GUIDE.md) - CI setup
• [Test Data Management](TEST_DATA_MANAGEMENT.md) - Result export for analytics

## 🔗 File Locations

• Analytics Script: `scripts/analytics.ts`
• Reports: `reports/analytics.*`
• Allure Results: `allure-results/`
• k6 Results: `k6-results/`
• History: `data/results/analytics-history.json`
