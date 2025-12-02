#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# Playwright Test Runner Script
# Equivalent to Python's run_tests.sh
# ═══════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}          Playwright TypeScript Test Framework${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"

# Parse arguments
TEST_TYPE=${1:-all}
BROWSER=${2:-chromium}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm ci
fi

# Install Playwright browsers if needed
if ! npx playwright --version > /dev/null 2>&1; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install --with-deps
fi

# Create output directories
mkdir -p test-results playwright-report coverage

echo -e "\n${YELLOW}Running tests: ${TEST_TYPE}${NC}\n"

case $TEST_TYPE in
    "unit")
        echo -e "${GREEN}Running unit tests...${NC}"
        npm run test:unit
        ;;
    "api")
        echo -e "${GREEN}Running API tests...${NC}"
        npm run test:api
        ;;
    "web")
        echo -e "${GREEN}Running web tests on ${BROWSER}...${NC}"
        npx playwright test --project=$BROWSER tests/web/
        ;;
    "visual")
        echo -e "${GREEN}Running visual tests...${NC}"
        npm run test:visual
        ;;
    "a11y"|"accessibility")
        echo -e "${GREEN}Running accessibility tests...${NC}"
        npm run test:a11y
        ;;
    "performance")
        echo -e "${GREEN}Running performance tests...${NC}"
        npm run test:performance
        ;;
    "contract")
        echo -e "${GREEN}Running contract tests...${NC}"
        npm run test:contract
        ;;
    "all")
        echo -e "${GREEN}Running all tests...${NC}"
        npm run test:unit
        npm test
        ;;
    "lint")
        echo -e "${GREEN}Running linter...${NC}"
        npm run lint
        ;;
    "ci")
        echo -e "${GREEN}Running CI pipeline...${NC}"
        npm run ci
        ;;
    *)
        echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
        echo "Usage: $0 [unit|api|web|visual|a11y|performance|contract|all|lint|ci] [browser]"
        exit 1
        ;;
esac

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}                    Tests completed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"

# Show report location
if [ -d "playwright-report" ]; then
    echo -e "\n${YELLOW}View HTML report: npx playwright show-report${NC}"
fi

if [ -d "coverage" ]; then
    echo -e "${YELLOW}View coverage: open coverage/index.html${NC}"
fi

