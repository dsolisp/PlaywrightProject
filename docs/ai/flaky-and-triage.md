# Flaky detection and AI triage (nightly)

## Flakiness Detective (optional)

```bash
pnpm add -D flakiness-detective-ts
```

Wire as Playwright reporter in `playwright.config.ts` only when experimenting (not default PR CI).

## pytest-history

N/A in this repo — see PythonSeleniumProject.

## AI triage

```bash
AI_TRIAGE_ENABLED=true pnpm run ai:triage
```

Requires Ollama. Output: `data/results/ai-triage.md`. Nightly workflow runs this with `continue-on-error`.
