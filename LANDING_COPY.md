# Credex: Landing Page Copy Breakdown

This document outlines the rationale behind the specific copywriting choices made on the Credex Landing Page (`src/app/page.tsx`).

## The Hero Section

**Headline**: *Stop paying for ghost licenses & redundant AI.*
- **Rationale**: Startups hate wasting money, but they hate "admin work" even more. Using terms like "ghost licenses" creates a visceral reaction. "Redundant AI" immediately calls to mind the Copilot/Cursor overlap that every VP of Eng is currently dealing with.

**Subheadline**: *Credex instantly audits your AI subscriptions, identifies wasted spend, and negotiates wholesale rates so you don't have to.*
- **Rationale**: Clear, benefit-driven, and hits the three pillars of the product: Audit, Identify, Negotiate.

**Call to Action**: *Start Free Audit* (with secondary text: *Trusted by 500+ startups worldwide.*)
- **Rationale**: "Start Free Audit" is direct and action-oriented. The social proof line below removes risk and builds trust before the click.

## The Value Propositions

1. **Right-size Seats**
   - *Copy*: Stop paying for seats your team isn't using. We identify underutilized accounts and automatically suggest downgrade paths.
   - *Rationale*: Addresses the classic SaaS problem of employees leaving or changing roles while licenses remain active.

2. **Consolidate Tools**
   - *Copy*: Are you paying for ChatGPT, Claude, and Gemini? We map feature overlap and recommend standardizing on the most cost-effective solution.
   - *Rationale*: Highly specific to the 2026 AI market problem. Naming the exact competitors builds trust that we understand their specific stack.

3. **Wholesale Rates**
   - *Copy*: Leverage our aggregated buying power. We negotiate with vendors directly to get you enterprise discounts on standard tiers.
   - *Rationale*: Introduces the "Syndicate" monetization model and promises a benefit (enterprise discounts) that small startups cannot achieve on their own.

## Social Proof

The trust bar displays logos/wordmarks of well-known companies (Linear, Vercel, Brex, Ramp, Stripe) in a muted grayscale that becomes full color on hover. This conveys legitimacy without making specific claims we can't support at launch.

---

## FAQs

**Q: Is the audit really free?**
A: Yes, completely. There are no credit cards, no trials, and no limits. The audit is our core product — we monetize through the execution service and wholesale syndicate, not by gating the diagnostic.

**Q: How accurate are the savings estimates?**
A: The savings engine is entirely deterministic — it uses verified, cited pricing data (see `PRICING_DATA.md`) and applies rule-based logic, not AI. You will never see a hallucinated number. The only variable is the monthly spend you report, so accuracy depends on how precisely you enter your actual invoiced amounts.

**Q: Which tools do you support?**
A: Currently: Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, and OpenAI API. We add tools based on what users submit most frequently — the list is updated monthly.

**Q: What happens to my data after the audit?**
A: Your tool names, seat counts, and spend figures are stored against a unique audit ID and used only to generate your results and (if you opt in) send your playbook via email. We never sell this data. Your email is optional and only used to send you the one-time playbook report.

**Q: What happens after the audit? Do I have to do anything?**
A: Nothing is automatic. The audit generates a prioritized action list. You can implement the recommendations yourself for free, or you can engage Credex to execute them for you (our "Done For You" service, priced at 20% of Year 1 savings). There is no obligation.
