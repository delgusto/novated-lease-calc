import {
  TAX_BRACKETS,
  MEDICARE_LEVY_RATE,
  MEDICARE_LEVY_THRESHOLD,
} from './constants';

/**
 * Calculates AU resident income tax (progressive brackets) plus Medicare levy.
 * Simplified: no LITO, no Medicare surcharge, no reportable fringe benefits feedback loop.
 */
export function calculateAnnualTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  const original = taxableIncome;
  let remaining = taxableIncome;
  let tax = 0;
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = TAX_BRACKETS[i];
    if (remaining > bracket.threshold) {
      tax += (remaining - bracket.threshold) * bracket.rate;
      remaining = bracket.threshold;
    }
  }

  const medicare =
    original > MEDICARE_LEVY_THRESHOLD ? original * MEDICARE_LEVY_RATE : 0;

  return tax + medicare;
}

export function calculateTakeHome(grossSalary: number): number {
  return grossSalary - calculateAnnualTax(grossSalary);
}

/**
 * Marginal tax rate (including Medicare) for the last dollar of salary.
 * Used to sanity-check pre-tax savings.
 */
export function marginalRate(grossSalary: number): number {
  for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
    if (grossSalary > TAX_BRACKETS[i].threshold) {
      const base = TAX_BRACKETS[i].rate;
      const medicare =
        grossSalary > MEDICARE_LEVY_THRESHOLD ? MEDICARE_LEVY_RATE : 0;
      return base + medicare;
    }
  }
  return 0;
}
