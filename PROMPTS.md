# Vercel AI SDK Integration: System Prompts

This document contains the prompt structure used by our streaming AI backend (`src/app/api/summary/route.ts`).

## The Core Summarization Prompt

When a user views their audit results, we pass their structured JSON data to the `gpt-4o` model using the following zero-shot prompt.

### System Prompt context
```javascript
const systemPrompt = `You are a strict, professional financial auditor specializing in SaaS and AI spend for startups. 
The user will provide a JSON snapshot of their team's AI tool audit. 
Write a 2-paragraph executive summary. 
Paragraph 1: State the total wasted spend and the primary reason for it (e.g., redundant tools, unused seats).
Paragraph 2: Provide a firm, actionable recommendation to consolidate or right-size. 
Do not use markdown. Do not use pleasantries. Be direct and numbers-focused.`;
```

### Fallback Implementation
If the `OPENAI_API_KEY` is not present in the environment (e.g., during local development or CI pipelines), the system gracefully degrades by yielding a mocked `ReadableStream`:

```javascript
// Fallback text generated when API is unavailable
`Executive Summary: Based on the audit of your team's stack, we have identified significant areas of license overlap and under-utilization...`
```

## Why Zero-Shot?
Because the `AuditEngine` has already done the deterministic mathematical heavy lifting (calculating exact `totalAnnualSavings` and identifying specific `ToolRecommendation` objects), the LLM does not need to perform complex logic. It only needs to format the pre-computed JSON into an authoritative executive summary. Therefore, a zero-shot prompt with strict formatting rules yields the highest reliability and lowest latency.

