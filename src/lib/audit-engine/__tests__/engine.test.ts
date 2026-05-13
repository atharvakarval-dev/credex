import { describe, test, expect } from "vitest";
import { runAudit } from "../index";
import { AuditInput, ToolRecommendation } from "../../../types/audit";

describe("Audit Engine — Core Invariants", () => {
  test("Team plan for 2 users flags right-sizing recommendation", () => {
    // Input: Claude Team plan, 2 seats, $60/mo
    const input: AuditInput = {
      tools: [
        {
          toolId: "claude",
          plan: "team",
          seats: 2,
          monthlySpend: 60,
        },
      ],
      teamSize: 2,
      useCase: "writing",
    };

    const result = runAudit(input);

    expect(result.recommendations).toHaveLength(1);
    const rec = result.recommendations[0];
    
    // Check right sizing or efficiency rule fired
    expect(["right_size_seats", "downgrade_plan"]).toContain(rec.recommendationType);
    expect(rec.monthlySavings).toBeGreaterThan(0);
  });

  test("Cursor Business + Windsurf Pro triggers consolidation recommendation", () => {
    // Input: cursor/business + windsurf/pro, coding use case
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          seats: 1,
          monthlySpend: 40,
        },
        {
          toolId: "windsurf",
          plan: "pro",
          seats: 1,
          monthlySpend: 15,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);
    
    const recs = result.recommendations.filter(
      (r: ToolRecommendation) => r.recommendationType === "consolidate"
    );
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  test("Total savings never exceeds total spend", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", seats: 1, monthlySpend: 40 },
        { toolId: "claude", plan: "max", seats: 1, monthlySpend: 100 },
      ],
      teamSize: 1,
      useCase: "mixed",
    };

    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBeLessThanOrEqual(140);
  });

  test("Already-optimal user gets no manufactured savings", () => {
    // Input: cursor/pro 1 seat, $20/mo, solo developer, coding use case
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          seats: 1,
          monthlySpend: 20,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].recommendationType).toBe("already_optimal");
    expect(result.recommendations[0].monthlySavings).toBe(0);
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
  });

  test("High savings flag triggers when savings exceed $500/mo", () => {
    // Multiple enterprise tools for a small team
    const input: AuditInput = {
      tools: [
        { toolId: "cursor", plan: "business", seats: 2, monthlySpend: 80 },
        { toolId: "claude", plan: "max", seats: 5, monthlySpend: 500 },
        { toolId: "chatgpt", plan: "team", seats: 5, monthlySpend: 150 },
      ],
      teamSize: 2,
      useCase: "mixed",
    };

    const result = runAudit(input);

    // This should trigger massive right-sizing and consolidation savings
    if (result.totalMonthlySavings > 500) {
      expect(result.isHighSavings).toBe(true);
    }
  });

  test("Annual savings is exactly 12x monthly savings", () => {
    const input: AuditInput = {
      tools: [
        { toolId: "github_copilot", plan: "business", seats: 2, monthlySpend: 38 },
      ],
      teamSize: 2,
      useCase: "coding",
    };

    const result = runAudit(input);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });
});
