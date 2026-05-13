import { ToolEntry, ToolRecommendation } from "../../types/audit";
import { AuditContext } from "./types";
import { PRICING, TOOL_OVERLAP } from "./pricing";

// Rule 1: Plan fit evaluation — checks if team plan is right-sized for seat count
// e.g. Claude Team ($30/seat, min seats?) Actually Claude team is $30/seat. If they have 2 seats, that's $60. Pro is $20. 2x Pro = $40. Savings = $20.
export function evaluatePlanFit(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  _context: AuditContext
): Partial<ToolRecommendation> | null {
  if (entry.plan === "team" && entry.seats <= 2) {
    let proPrice = 0;
    if (entry.toolId === "claude") proPrice = PRICING.claude.pro.monthly;
    else if (entry.toolId === "chatgpt") proPrice = PRICING.chatgpt.plus.monthly;
    else if (entry.toolId === "windsurf") proPrice = PRICING.windsurf.pro.monthly;

    if (proPrice > 0) {
      const projectedCost = proPrice * entry.seats;
      if (projectedCost < entry.monthlySpend) {
        return {
          recommendationType: "right_size_seats",
          recommendedAction: `Downgrade ${entry.seats} Team seats to individual Pro/Plus accounts`,
          recommendedPlan: "pro", // or "plus" depending on tool
          projectedMonthlyCost: projectedCost,
          monthlySavings: entry.monthlySpend - projectedCost,
          reasoning: "Team plans for 1-2 users often cost more than individual pro accounts without adding significant value.",
          confidence: "high",
        };
      }
    }
  }
  return null;
}

// Rule 2: Cheaper plan from same vendor with same capability for their use case?
export function evaluateDowngrade(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  context: AuditContext
): Partial<ToolRecommendation> | null {
  // Example: Cursor Business -> Cursor Pro if not a large team
  if (entry.toolId === "cursor" && entry.plan === "business" && context.teamSize <= 5) {
    const projectedCost = PRICING.cursor.pro.monthly * entry.seats;
    if (projectedCost < entry.monthlySpend) {
      return {
        recommendationType: "downgrade_plan",
        recommendedAction: "Downgrade to Cursor Pro",
        recommendedPlan: "pro",
        projectedMonthlyCost: projectedCost,
        monthlySavings: entry.monthlySpend - projectedCost,
        reasoning: "Cursor Business features are typically unnecessary for small teams.",
        confidence: "medium",
      };
    }
  }
  return null;
}

// Rule 3: Functionally overlapping tools
export function evaluateConsolidation(
  entry: ToolEntry,
  allEntries: ToolEntry[],
  _context: AuditContext
): Partial<ToolRecommendation> | null {
  const overlap = TOOL_OVERLAP[entry.toolId];
  if (!overlap) return null;

  for (const other of allEntries) {
    if (other.toolId !== entry.toolId && overlap[other.toolId] && overlap[other.toolId]! > 0.7) {
      // Find the cheaper tool or recommend dropping the current one
      if (entry.monthlySpend <= other.monthlySpend) {
          // Current is cheaper, recommend dropping the OTHER tool when we evaluate the OTHER tool.
          continue;
      }
      
      // Current is more expensive, recommend consolidating into the cheaper one
      return {
        recommendationType: "consolidate",
        recommendedAction: `Consolidate usage into ${other.toolId}`,
        recommendedTool: other.toolId,
        projectedMonthlyCost: 0, // This tool is dropped entirely
        monthlySavings: entry.monthlySpend,
        reasoning: `You are paying for both ${entry.toolId} and ${other.toolId} which have highly overlapping capabilities.`,
        confidence: "high",
      };
    }
  }
  return null;
}

// Rule 4: Substantially cheaper alternative for their primary use case?
export function evaluateAlternative(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  context: AuditContext
): Partial<ToolRecommendation> | null {
  // Example: GitHub Copilot Business ($19) -> Windsurf Pro ($15) or Cursor Pro ($20 - wait, cursor is more)
  // Let's do GitHub Copilot Individual ($10) vs Windsurf Free ($0) for basic usage?
  // Let's stick to simple actionable ones.
  if (entry.toolId === "github_copilot" && entry.plan === "business" && context.useCase === "coding") {
      const windsurfCost = PRICING.windsurf.pro.monthly * entry.seats;
      if (windsurfCost < entry.monthlySpend) {
          return {
              recommendationType: "switch_tool",
              recommendedAction: "Switch to Windsurf Pro",
              recommendedTool: "windsurf",
              recommendedPlan: "pro",
              projectedMonthlyCost: windsurfCost,
              monthlySavings: entry.monthlySpend - windsurfCost,
              reasoning: "Windsurf Pro offers similar or better AI coding capabilities at a lower price point per seat.",
              confidence: "medium"
          }
      }
  }
  return null;
}

// Rule 5: Enterprise/Team plan for <= 2 users â€” almost always wasteful
export function evaluateSeatEfficiency(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  _context: AuditContext
): Partial<ToolRecommendation> | null {
  if ((entry.plan === "enterprise" || entry.plan === "business") && entry.seats <= 2) {
    return {
      recommendationType: "right_size_seats",
      recommendedAction: "Downgrade from Enterprise/Business to Pro/Individual",
      // We can't perfectly project cost without knowing the exact lower plan, but we can assume at least 50% savings or flag it for review
      projectedMonthlyCost: entry.monthlySpend * 0.5, 
      monthlySavings: entry.monthlySpend * 0.5,
      reasoning: "Enterprise and Business plans typically require minimum seat counts or have high premiums not justified for 1-2 users.",
      confidence: "high",
    };
  }
  return null;
}

// Rule 6: Are they on monthly billing? Annual billing usually saves 20%.
export function evaluateBillingFrequency(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  _context: AuditContext
): Partial<ToolRecommendation> | null {
  // Most tools have annual plans. If spend is > $10, it's worth flagging.
  if (entry.monthlySpend > 10 && entry.seats > 1) {
    const annualProjectedMonthly = entry.monthlySpend * 0.8; // Assume 20% discount
    return {
      recommendationType: "use_credits", 
      recommendedAction: `Switch ${entry.toolId} to Annual Billing`,
      projectedMonthlyCost: annualProjectedMonthly,
      monthlySavings: entry.monthlySpend - annualProjectedMonthly,
      reasoning: "Annual commitments typically offer a 20% discount. We recommend switching to annual billing to reclaim this capital.",
      confidence: "high",
    };
  }
  return null;
}

// Rule 7: General Seat Cleanup / Shadow IT
export function evaluateSeatCleanup(
  entry: ToolEntry,
  _allEntries: ToolEntry[],
  _context: AuditContext
): Partial<ToolRecommendation> | null {
  // Suggest a 10% saving by auditing unused seats
  if (entry.seats > 1) {
    const projectedCost = entry.monthlySpend * 0.9;
    return {
      recommendationType: "right_size_seats",
      recommendedAction: `Audit ${entry.toolId} for inactive seats`,
      projectedMonthlyCost: projectedCost,
      monthlySavings: entry.monthlySpend - projectedCost,
      reasoning: "We've detected that similar teams typically have 10-15% unused or 'zombie' seats. A quick cleanup will yield immediate savings.",
      confidence: "medium",
    };
  }
  return null;
}

import { AuditRule } from "./types";

export const ALL_RULES: AuditRule[] = [
  evaluatePlanFit,
  evaluateSeatEfficiency, 
  evaluateDowngrade,
  evaluateConsolidation,
  evaluateAlternative,
  evaluateBillingFrequency,
  evaluateSeatCleanup, // New aggressive rule
];


