import formatINR from "./formatINR";

describe("formatINR", () => {
  it("formats undefined/null/0 as ₹0", () => {
    expect(formatINR(undefined)).toBe("₹0");
    expect(formatINR(null)).toBe("₹0");
    expect(formatINR(0)).toBe("₹0");
  });
  it("formats numbers correctly", () => {
    expect(formatINR(123456)).toBe("₹1,23,456");
    expect(formatINR("1000")).toBe("₹1,000");
  });
});
