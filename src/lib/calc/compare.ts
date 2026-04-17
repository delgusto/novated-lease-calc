import { calculateAnnualTax, calculateTakeHome } from './tax';
import {
  isEvFbtExempt,
  ecmContribution,
  annualFbtLiability,
  statutoryTaxableValue,
  type FuelType,
} from './fbt';
import { novatedLeaseFinance, carLoan } from './lease';
import { annualRunningCostsTotal } from './runningCosts';

export type CompareInput = {
  grossSalary: number;
  carPriceInclGst: number;
  termYears: number;
  annualKm: number;
  fuelType: FuelType;
  /** optional override — default 8.5% */
  leaseRate?: number;
  /** optional override — default 8.9% */
  loanRate?: number;
};

export type ScenarioResult = {
  label: string;
  /** Net out-of-pocket per year (take-home reduction + any direct spend) */
  annualNetCost: number;
  /** Total over the lease/loan term */
  totalCost: number;
  /** Car ownership at end of term? */
  ownsCar: boolean;
  /** Weekly equivalent, for UI display */
  weeklyNetCost: number;
  /** Breakdown for UI */
  breakdown: Record<string, number>;
};

export type CompareOutput = {
  novatedEvExempt: ScenarioResult | null; // null if not eligible (ICE or over LCT)
  novatedEcm: ScenarioResult;             // works for both ICE and EV — the standard novated path
  cash: ScenarioResult;
  loan: ScenarioResult;
  best: string;
  savingsVsCash: number; // savings from the best scenario vs cash
  context: {
    fbtExempt: boolean;
    residualAtEnd: number;
    fuelType: FuelType;
  };
};

/**
 * Main comparison. All four scenarios are priced for the SAME car and SAME term.
 * We measure "net cost" as: gross_salary - take_home - value_retained_at_end.
 * Value retained = residual/resale value you'd get back at term end.
 */
export function compareScenarios(input: CompareInput): CompareOutput {
  const { grossSalary, carPriceInclGst, termYears, annualKm, fuelType } = input;
  const running = annualRunningCostsTotal(fuelType, annualKm);
  const lease = novatedLeaseFinance({
    carPriceInclGst,
    termYears,
    annualRate: input.leaseRate,
  });

  // Assume resale value ≈ the ATO-prescribed residual (conservative — real market values often higher for EVs short-term).
  const resaleAtEnd = lease.residualInclGst;

  // ---- 1. NOVATED with ECM (works for any car; no FBT exemption applied) ----
  const novatedAnnualPackage =
    lease.annualFinanceCost + lease.fleetFeeAnnual + running.total;
  const ecm = ecmContribution(carPriceInclGst); // post-tax offset to zero FBT
  const novatedPreTax = novatedAnnualPackage - ecm;

  const salaryAfterPackage = grossSalary - novatedPreTax;
  const takeHomeAfterPackage = calculateTakeHome(salaryAfterPackage);
  const takeHomeAfterEcm = takeHomeAfterPackage - ecm;
  const baselineTakeHome = calculateTakeHome(grossSalary);

  // Net annual cost = reduction in take-home (because car is already paid for inside the package)
  const novatedEcmAnnualCost = baselineTakeHome - takeHomeAfterEcm;
  const novatedEcmTotal = novatedEcmAnnualCost * termYears - resaleAtEnd;

  const novatedEcm: ScenarioResult = {
    label: 'Novated Lease (ICE/standard)',
    annualNetCost: novatedEcmAnnualCost,
    totalCost: novatedEcmTotal,
    weeklyNetCost: novatedEcmAnnualCost / 52,
    ownsCar: false, // you'd need to pay the residual to keep it
    breakdown: {
      annualPackageDeduction: novatedPreTax,
      postTaxEcmContribution: ecm,
      reducedTakeHome: baselineTakeHome - takeHomeAfterEcm,
      resaleAtEnd,
    },
  };

  // ---- 2. NOVATED EV-EXEMPT (no ECM, full pre-tax) ----
  let novatedEvExempt: ScenarioResult | null = null;
  const exempt = isEvFbtExempt(fuelType, carPriceInclGst);
  if (exempt) {
    const evPreTax = novatedAnnualPackage; // no ECM, everything pre-tax
    const evSalaryAfter = grossSalary - evPreTax;
    const evTakeHome = calculateTakeHome(evSalaryAfter);
    const evAnnualCost = baselineTakeHome - evTakeHome;
    const evTotal = evAnnualCost * termYears - resaleAtEnd;

    novatedEvExempt = {
      label: 'Novated Lease (EV FBT-exempt)',
      annualNetCost: evAnnualCost,
      totalCost: evTotal,
      weeklyNetCost: evAnnualCost / 52,
      ownsCar: false,
      breakdown: {
        annualPackageDeduction: evPreTax,
        postTaxEcmContribution: 0,
        reducedTakeHome: evAnnualCost,
        resaleAtEnd,
      },
    };
  }

  // ---- 3. CASH OUTRIGHT ----
  // Pay full price day-1 from post-tax savings, then running costs post-tax each year.
  const cashAnnualCost = running.total;
  // Opportunity cost of the lump sum is ignored in v1 (easier to explain).
  const cashTotal = carPriceInclGst + cashAnnualCost * termYears - resaleAtEnd;
  const cash: ScenarioResult = {
    label: 'Buy with cash',
    annualNetCost: cashAnnualCost + carPriceInclGst / termYears, // amortised for weekly display
    totalCost: cashTotal,
    weeklyNetCost: (cashAnnualCost + carPriceInclGst / termYears) / 52,
    ownsCar: true,
    breakdown: {
      upfront: carPriceInclGst,
      annualRunningCosts: cashAnnualCost,
      resaleAtEnd,
    },
  };

  // ---- 4. CAR LOAN ----
  const loan = carLoan({
    carPriceInclGst,
    termYears,
    annualRate: input.loanRate,
  });
  // All repayments + running costs are post-tax
  const loanAnnualCost = loan.annualRepayment + running.total;
  const loanTotal = loanAnnualCost * termYears - resaleAtEnd;
  const loanResult: ScenarioResult = {
    label: 'Car loan',
    annualNetCost: loanAnnualCost,
    totalCost: loanTotal,
    weeklyNetCost: loanAnnualCost / 52,
    ownsCar: true,
    breakdown: {
      annualRepayment: loan.annualRepayment,
      totalInterest: loan.totalInterest,
      annualRunningCosts: running.total,
      resaleAtEnd,
    },
  };

  // Best-of
  const scenarios: { name: string; total: number }[] = [
    { name: 'novatedEcm', total: novatedEcm.totalCost },
    { name: 'cash', total: cash.totalCost },
    { name: 'loan', total: loanResult.totalCost },
  ];
  if (novatedEvExempt) scenarios.push({ name: 'novatedEvExempt', total: novatedEvExempt.totalCost });
  scenarios.sort((a, b) => a.total - b.total);
  const best = scenarios[0].name;

  return {
    novatedEvExempt,
    novatedEcm,
    cash,
    loan: loanResult,
    best,
    savingsVsCash: cash.totalCost - scenarios[0].total,
    context: {
      fbtExempt: exempt,
      residualAtEnd: resaleAtEnd,
      fuelType,
    },
  };
}

// Exports for tests
export const _internals = {
  calculateAnnualTax,
  calculateTakeHome,
  ecmContribution,
  annualFbtLiability,
  statutoryTaxableValue,
};
