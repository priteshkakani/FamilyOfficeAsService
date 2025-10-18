import { describe, it, expect } from "vitest";
import { getInvestmentRecs } from "../lib/ruleEngine";

describe("ruleEngine.getInvestmentRecs", () => {
  it("recommends emergency fund when savingsRate high but emergency months low", () => {
    const recs = getInvestmentRecs({
      savingsRate: 30,
      emergencyFundMonths: 3,
      allocation: { equity: 50 },
    });
    expect(recs.some((r) => r.id === "efund")).toBeTruthy();
  });

  it("recommends equity boost when equity pct low", () => {
    const recs = getInvestmentRecs({
      savingsRate: 10,
      emergencyFundMonths: 12,
      allocation: { equity: 20 },
    });
    expect(recs.some((r) => r.id === "equity_boost")).toBeTruthy();
  });
});
