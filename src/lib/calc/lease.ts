import {
  RESIDUAL_VALUES,
  DEFAULT_LEASE_INTEREST_RATE,
  DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL,
  DEFAULT_CAR_LOAN_RATE,
  GST_RATE,
} from './constants';

/**
 * Amortised monthly payment with a balloon (residual) at the end.
 * PV: present value / financed amount
 * FV: balloon / residual to pay at end
 * annualRate: nominal annual rate (e.g. 0.085 for 8.5%)
 * months: total term in months
 */
export function amortisedPayment(
  pv: number,
  fv: number,
  annualRate: number,
  months: number,
): number {
  const r = annualRate / 12;
  if (r === 0) return (pv - fv) / months;
  return (pv - fv / Math.pow(1 + r, months)) * r / (1 - Math.pow(1 + r, -months));
}

export function residualPercent(termYears: number): number {
  const pct = RESIDUAL_VALUES[termYears];
  if (pct === undefined) {
    throw new Error(`Unsupported term ${termYears}; supported: 1-5 years.`);
  }
  return pct;
}

/**
 * Novated lease finance calculation.
 * AU novated leases are structured so the employer claims the GST input credit
 * on the purchase — so the FINANCED amount is GST-exclusive.
 * The residual at end of lease IS subject to GST when the employee pays it.
 */
export function novatedLeaseFinance(opts: {
  carPriceInclGst: number;
  termYears: number;
  annualRate?: number;
}) {
  const rate = opts.annualRate ?? DEFAULT_LEASE_INTEREST_RATE;
  const exGst = opts.carPriceInclGst / (1 + GST_RATE);
  const residualPct = residualPercent(opts.termYears);
  const residualExGst = exGst * residualPct;
  const residualInclGst = residualExGst * (1 + GST_RATE);
  const monthly = amortisedPayment(exGst, residualExGst, rate, opts.termYears * 12);
  const annualFinanceCost = monthly * 12;

  return {
    financedAmount: exGst,
    residualExGst,
    residualInclGst,
    monthlyFinance: monthly,
    annualFinanceCost,
    fleetFeeAnnual: DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL,
  };
}

/**
 * Standard (post-tax) car loan: secured or unsecured consumer loan, no balloon.
 * Pays the car off in full over the term.
 */
export function carLoan(opts: {
  carPriceInclGst: number;
  termYears: number;
  deposit?: number;
  annualRate?: number;
}) {
  const rate = opts.annualRate ?? DEFAULT_CAR_LOAN_RATE;
  const deposit = opts.deposit ?? 0;
  const principal = opts.carPriceInclGst - deposit;
  const months = opts.termYears * 12;
  const monthly = amortisedPayment(principal, 0, rate, months);

  return {
    principal,
    monthlyRepayment: monthly,
    annualRepayment: monthly * 12,
    totalInterest: monthly * months - principal,
    totalRepaid: monthly * months + deposit,
  };
}
