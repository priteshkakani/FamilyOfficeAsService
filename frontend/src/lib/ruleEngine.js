// Consolidated rule engine — functions accept either the compact param object
// (legacy) or rich profile/allocation signatures.

function _calcSavingsRateFromProfile(profile = {}) {
  const income = Number(profile.monthly_income || 0);
  const expenses = Number(profile.monthly_expenses || 0);
  return income > 0
    ? Math.max(0, Math.round((1 - expenses / income) * 100))
    : 0;
}

export function getInvestmentRecs(a, b = [], c = []) {
  // a can be either: { savingsRate, emergencyFundMonths, allocation } OR a profile object
  let savingsRate = 0;
  let emergencyFundMonths = 0;
  let allocation = {};

  if (
    a &&
    typeof a === "object" &&
    ("savingsRate" in a || "emergencyFundMonths" in a)
  ) {
    savingsRate = Number(a.savingsRate || 0);
    emergencyFundMonths = Number(a.emergencyFundMonths || 0);
    allocation = a.allocation || {};
  } else {
    // treat as profile
    const profile = a || {};
    allocation = Array.isArray(c) ? c : [];
    savingsRate = _calcSavingsRateFromProfile(profile);
    // attempt to derive emergencyFundMonths from profile if available
    emergencyFundMonths = Number(profile.emergency_fund_months || 0);
  }

  const recs = [];
  if (savingsRate > 25 && emergencyFundMonths < 6) {
    recs.push({
      id: "efund",
      title: "Build Emergency Fund",
      rationale: "Savings rate is good; top up liquid funds to reach 6 months.",
      product: "Liquid Funds",
      cta: "Add Task",
    });
  }

  const equityPct =
    (allocation && (allocation.equity || allocation.equity_pct)) || 0;
  if (equityPct < 40) {
    recs.push({
      id: "equity_boost",
      title: "Increase Equity Allocation",
      rationale: "Long-term goals need equity; consider index funds or SIPs.",
      product: "Index Funds",
      cta: "Create SIP",
    });
  }
  return recs;
}

export function getInsuranceRecs(a = {}, b = [], c = []) {
  // a can be compact { termCoverMultiple, healthCover, familySize } or profile
  let termCoverMultiple = 0;
  let healthCover = 0;
  let familySize = 1;

  if (
    a &&
    typeof a === "object" &&
    ("termCoverMultiple" in a || "healthCover" in a)
  ) {
    termCoverMultiple = Number(a.termCoverMultiple || 0);
    healthCover = Number(a.healthCover || 0);
    familySize = Number(a.familySize || 1);
  } else {
    const profile = a || {};
    const family = b || [];
    const annualIncome = Number(profile.monthly_income || 0) * 12;
    termCoverMultiple = profile.term_cover
      ? Number(profile.term_cover) / (annualIncome || 1)
      : 0;
    healthCover = Number(profile.health_cover || 0);
    familySize = family.length || 1;
  }

  const recs = [];
  if (termCoverMultiple < 10) {
    recs.push({
      id: "term_gap",
      title: "Term Cover Gap",
      rationale: "Term insurance less than recommended multiple of income.",
      product: "Term Insurance",
      cta: "Add Task",
    });
  }
  if (healthCover < 1000000 && familySize > 3) {
    recs.push({
      id: "health",
      title: "Increase Health Cover",
      rationale: "Family size suggests higher health cover.",
      product: "Family Floater",
      cta: "Add Task",
    });
  }
  return recs;
}
