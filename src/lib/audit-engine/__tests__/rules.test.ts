import { describe, test, expect } from "vitest";
import { evaluatePlanFit, evaluateSeatEfficiency } from "../rules";
import { ToolEntry } from "../../../types/audit";

describe("Audit Engine â€” Rules", () => {
  test("evaluatePlanFit identifies inefficient team plans", () => {
    const entry: ToolEntry = {
      toolId: "claude",
      plan: "team",
      seats: 2,
      monthlySpend: 60,
    };
    
    const rec = evaluatePlanFit(entry, [], { teamSize: 2, useCase: "writing" });
    expect(rec).not.toBeNull();
    expect(rec?.recommendationType).toBe("right_size_seats");
    expect(rec?.monthlySavings).toBe(20);
  });

  test("evaluateSeatEfficiency catches small teams on enterprise/business", () => {
    const entry: ToolEntry = {
      toolId: "cursor",
      plan: "business",
      seats: 1,
      monthlySpend: 40,
    };
    
    const rec = evaluateSeatEfficiency(entry, [], { teamSize: 1, useCase: "coding" });
    expect(rec).not.toBeNull();
    expect(rec?.recommendationType).toBe("right_size_seats");
    expect(rec?.monthlySavings).toBeGreaterThan(0);
  });
});

