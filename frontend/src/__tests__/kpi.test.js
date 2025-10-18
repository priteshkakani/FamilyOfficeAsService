import { describe, it, expect } from "vitest";
import { calcSavingsRate } from "../utils/kpi";

describe("calcSavingsRate", () => {
  it("returns 0 when income is zero or negative", () => {
    expect(calcSavingsRate(0, 0)).toBe(0);
    expect(calcSavingsRate(-1000, 200)).toBe(0);
  });

  it("calculates percentage correctly", () => {
    expect(calcSavingsRate(10000, 7000)).toBe(30);
    expect(calcSavingsRate(50000, 25000)).toBe(50);
  });
});
