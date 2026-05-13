import { AuditInput, AuditResult, ToolRecommendation } from "../../types/audit";
import { ALL_RULES } from "./rules";

export function runAudit(
  input: AuditInput
): Omit<AuditResult, "auditId" | "aiSummary"> {
  const recommendations: ToolRecommendation[] = [];

  for (const entry of input.tools) {
    let bestRec: Partial<ToolRecommendation> | null = null;

    // Run all rules for this entry
    for (const rule of ALL_RULES) {
      const rec = rule(entry, input.tools, {
        teamSize: input.teamSize,
        useCase: input.useCase,
      });

      if (rec) {
        // Keep the recommendation with the highest savings
        if (!bestRec || (rec.monthlySavings || 0) > (bestRec.monthlySavings || 0)) {
          bestRec = rec;
        }
      }
    }

    if (bestRec && (bestRec.monthlySavings || 0) > 0) {
      // Validate savings
      const savings = Math.min(
        bestRec.monthlySavings || 0,
        entry.monthlySpend
      ); // Cannot save more than spend
      
      const projectedCost = Math.max(0, entry.monthlySpend - savings); // Cannot be negative

      recommendations.push({
        toolId: entry.toolId,
        currentPlan: entry.plan,
        currentMonthlyCost: entry.monthlySpend,
        recommendationType: bestRec.recommendationType || "already_optimal",
        recommendedAction: bestRec.recommendedAction || "",
        recommendedTool: bestRec.recommendedTool,
        recommendedPlan: bestRec.recommendedPlan,
        projectedMonthlyCost: projectedCost,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reasoning: bestRec.reasoning || "",
        confidence: bestRec.confidence || "medium",
      });
    } else {
      // Already optimal
      recommendations.push({
        toolId: entry.toolId,
        currentPlan: entry.plan,
        currentMonthlyCost: entry.monthlySpend,
        recommendationType: "already_optimal",
        recommendedAction: "Keep current setup",
        projectedMonthlyCost: entry.monthlySpend,
        monthlySavings: 0,
        annualSavings: 0,
        reasoning: "Your current setup and spend are fully optimized for your team size and use case.",
        confidence: "high",
      });
    }
  }

  // Calculate totals
  const totalMonthlySpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  let totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  // Invariant validation: total savings cannot exceed total spend
  if (totalMonthlySavings > totalMonthlySpend) {
      totalMonthlySavings = totalMonthlySpend;
  }

  const totalAnnualSavings = totalMonthlySavings * 12;

  // Derive flags
  const isHighSavings = totalMonthlySavings > 500;
  const isAlreadyOptimal = totalMonthlySavings < 100;
  
  // Simple check for overlap (more than 1 tool with same usecase, e.g. 2 coding tools)
  const hasOverlap = recommendations.some(r => r.recommendationType === 'consolidate');

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings,
    isAlreadyOptimal,
    hasOverlap,
    generatedAt: new Date().toISOString(),
  };
}
