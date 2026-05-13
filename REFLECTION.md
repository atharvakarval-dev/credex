# Credex AI Spend Audit — Project Reflection

## 1. What was the hardest technical problem you solved?

The hardest problem was making the audit engine's math trustworthy. The temptation was to let the LLM calculate savings, which would have been faster to build but catastrophically unreliable — LLMs hallucinate numbers, and telling a founder they'll save $18,000/year when the real figure is $3,200 would destroy any trust the product is trying to build.

The solution was treating the audit engine as a pure function pipeline — zero side effects, zero AI, zero ambiguity. Every number in `pricing.ts` has a cited source URL in `PRICING_DATA.md`. Every rule in `rules.ts` is independently testable. The engine runs synchronously and deterministically: same input always produces the same output. The LLM only touches the final executive summary paragraph, where stylistic variance is a feature, not a bug.

The trickiest edge case was the savings invariant: `totalMonthlySavings` can never exceed the sum of all current monthly spend. This sounds obvious but breaks in subtle ways when multiple rules fire on the same tool and you naively add their individual savings together. The fix was selecting only the single highest-confidence, highest-savings recommendation per tool before summing — not stacking recommendations.

## 2. What would you do differently with more time?

Two things stand out.

First, I would have connected to real billing data rather than relying on manual self-reporting. The product's value proposition weakens significantly when users have to remember what they're paying — the friction of manual entry introduces recall bias, and people routinely underestimate their subscriptions. Integrating with Brex, Ramp, or Stripe directly would have made the audit both more accurate and more effortless. The audit would actually be an audit, not a self-assessment.

Second, I would have built the "Done For You" execution layer — the actual downgrade automation. Right now the product identifies waste and stops. The highest-value moment in the funnel is the 10 minutes after a founder discovers they're wasting $14,000/year. That's when they want someone to just fix it, not a PDF playbook. OAuth-based integrations with vendor admin dashboards would convert the tool from a report generator into an action engine, which is where the real monetization lives.

## 3. What architectural decision are you most confident was correct?

Separating the audit result from the AI summary, both architecturally and temporally.

The `/api/audit` route runs the deterministic engine, persists the structured result, and returns immediately — typically under 200ms. The `/api/summary` route streams the LLM-generated paragraph separately, in parallel, after the user is already looking at their savings numbers.

This meant the core value — the headline savings figure and per-tool recommendations — is never blocked by Anthropic's API latency or quota limits. If the AI call fails, times out, or hits a rate limit, the user sees their full audit with a graceful fallback summary. They never see a spinner where their savings number should be.

This separation also made the codebase significantly easier to test. The engine tests don't need API keys, don't need a database, and run in under a second.

## 4. What would you need to validate before betting the company on this?

The core business assumption is that startups are meaningfully overspending on AI tools and that a free audit will convert a statistically significant number of them into paying clients for the execution service.

Both parts of that assumption need validation independently. On overspend: the interview data suggests the problem is real, but three interviews is not a sample. I'd want to see actual billing data from 50 companies before treating the $6,000/year average waste figure as reliable enough to put in marketing copy.

On conversion: the "email gate after value" design is a hypothesis. We show the savings number first, then ask for an email to receive the full playbook. The theory is that users who've already seen $15,000 in identified savings have enough intent to convert at a high rate. That's plausible but untested. A 14-day cohort of 500 audit completions would tell us whether the conversion rate justifies the CAC assumptions in `ECONOMICS.md`.

## 5. How does this project connect to Credex's actual business?

The audit tool is not the business — it's the top of the funnel. Its job is to make the problem visceral and quantified for the user, then hand them off to the actual Credex value proposition: execution and wholesale access.

The lead capture is designed around intent signals rather than volume. A user who has just learned they're wasting $22,000 per year and then submits their email is categorically different from someone who clicked a "get a free quote" CTA. They have a specific, quantified problem, a pre-generated playbook, and psychological momentum to act. That makes the downstream sales conversation dramatically shorter.

The viral OG image loop compounds this. A founder who shares their audit result in a Slack community isn't just sharing content — they're surfacing a specific dollar amount that immediately makes every other founder in that channel wonder what their own number looks like. The product markets itself via the problem it solves, which is the only sustainable acquisition strategy for a tool in a crowded "SaaS spend management" category.