# Multi-stage Dockerfile for Playwright TypeScript Test Framework

# ═══════════════════════════════════════════════════════════════════
# Stage 1: Dependencies
# ═══════════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/playwright:v1.40.1-jammy AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# ═══════════════════════════════════════════════════════════════════
# Stage 2: Test Runner
# ═══════════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/playwright:v1.40.1-jammy AS runner

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create directories for test artifacts
RUN mkdir -p test-results playwright-report coverage allure-results

# Environment variables
ENV CI=true
ENV HEADLESS=true
ENV NODE_ENV=test

# Default command: run all tests
CMD ["npm", "test"]

# ═══════════════════════════════════════════════════════════════════
# Alternative commands:
# 
# Run specific test suite:
#   docker run playwright-tests npm run test:api
#   docker run playwright-tests npm run test:web
#
# Run with headed browser (requires X11):
#   docker run -e HEADLESS=false playwright-tests npm run test:headed
#
# Generate report:
#   docker run -v $(pwd)/playwright-report:/app/playwright-report playwright-tests npm run report
# ═══════════════════════════════════════════════════════════════════

