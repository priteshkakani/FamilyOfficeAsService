export function calcSavingsRate(monthlyIncome = 0, monthlyExpenses = 0) {
  const income = Number(monthlyIncome || 0);
  const expenses = Number(monthlyExpenses || 0);
  if (income <= 0) return 0;
  return Math.round(((income - expenses) / income) * 100);
}
