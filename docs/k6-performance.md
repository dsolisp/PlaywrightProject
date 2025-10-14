# Performance Testing with k6

This project includes performance testing using [k6](https://k6.io/), a modern load testing tool.

## Setup

Ensure k6 is installed:

```bash
# macOS
brew install k6

# Or download from https://k6.io/docs/get-started/installation/
```

## Running Tests

### Local Development

- **Short run** (quick smoke test): `npm run k6:run:short`
- **Full run**: `npm run k6:run`

### In Tests

The performance tests are integrated into the Jest suite:

```bash
npx jest src/tests/perf/k6.spec.ts
```

## Configuration

Thresholds are defined in `k6-config.json`:

```json
{
  "short": {
    "p95": 1000,
    "failed": 0.1
  },
  "full": {
    "p95": 500,
    "failed": 0.01
  }
}
```

- `p95`: 95th percentile response time in ms
- `failed`: Failure rate (0.0 to 1.0)

## CI Integration

The CI pipeline runs `npm run k6:run:short` and fails the build if thresholds are exceeded.

Results are uploaded as artifacts for review.

## Script Details

- `k6/search_engine.k6.js`: The k6 test script
- `scripts/run_k6_impl.js`: Node wrapper that runs k6 and asserts thresholds
- `scripts/run_k6.ts`: TypeScript interface for tests
