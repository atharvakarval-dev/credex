# AI Spend Audit: Pricing Data & Citations

This document serves as the source of truth for the baseline pricing metrics used in our rules engine (`src/lib/audit-engine/pricing.ts`). All figures are based on publicly available vendor pricing pages as of Q1 2026.

## 1. Developer Tooling (Copilot vs. Cursor)
- **GitHub Copilot Business**: $19/user/month
  - *Source*: [GitHub Pricing](https://github.com/pricing)
- **Cursor Pro**: $20/user/month
  - *Source*: [Cursor Pricing](https://www.cursor.com/pricing)
  - *Note*: Cursor provides full IDE integration, rendering a separate Copilot subscription largely redundant for users on Cursor Pro.

## 2. LLM Chat Subscriptions
- **ChatGPT Plus**: $20/user/month
  - *Source*: [OpenAI Pricing](https://openai.com/chatgpt/pricing)
- **Claude Pro**: $20/user/month
  - *Source*: [Anthropic Pricing](https://www.anthropic.com/pricing)
- **Gemini Advanced**: $19.99/user/month
  - *Source*: [Google One AI Premium](https://one.google.com/explore-plan/gemini-advanced)

## 3. General Operations
- **Notion AI**: $8/user/month (when billed annually with Notion Plus)
  - *Source*: [Notion Pricing](https://www.notion.so/pricing)
- **Midjourney**: $30/user/month (Pro Plan equivalent)
  - *Source*: [Midjourney Plans](https://docs.midjourney.com/docs/plans)

## Calculation Assumptions
- **Annualization**: Monthly costs are multiplied by 12 to calculate `totalAnnualSavings` in the engine.
- **Overhead Multiplier**: We do *not* factor in management overhead time to these specific pricing numbers; they represent hard license costs only.
