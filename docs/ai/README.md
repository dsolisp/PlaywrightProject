# AI tooling (PlaywrightProject)

**Policy:** [ADR-019](../adr/ADR-019-ai-in-test-automation.md) · Portfolio [AI_ROADMAP](../../../shared-docs/docs/AI_ROADMAP.md)

## Setup

```bash
cp .env.ai.example .env.ai
# Local OSS default: Ollama
ollama pull llama3.2
```

## Dev-time authoring (Tier 1 — no CI cost)

```bash
# Playwright Test Agents (VS Code / Cursor)
pnpm run ai:init-agents

# MCP server (add to Cursor — see mcp-config.example.json)
npx @playwright/mcp@latest
```

Store generated plans under `docs/ai/plans/`; review before merging specs (Law 3).

## Runtime healing (Tier 2)

- `AI_HEALING_ENABLED=true` uses [utils/healing-locator.ts](../../utils/healing-locator.ts) on SauceDemo login (username + submit).
- Heuristic fallbacks run first; optional **healwright** / **autoheal-locator-js** when installed.
- Promote stable selectors: `pnpm run ai:promote-heal`

## Nightly only

- `AI_TRIAGE_ENABLED=true` + `pnpm run ai:triage` after failures (needs Ollama + Allure results).

## Optional packages

```bash
pnpm add -D healwright
# or autoheal-locator-js — set GROQ_API_KEY / Ollama per library docs
```
