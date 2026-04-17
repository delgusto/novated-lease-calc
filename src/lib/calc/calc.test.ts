import { describe, it, expect } from 'vitest';
import { calculateAnnualTax, calculateTakeHome, marginalRate } from './tax';
import { isEvFbtExempt, ecmContribution, statutoryTaxableValue } from './fbt';
import { amortisedPayment, residualPercent, novatedLeaseFinance } from './lease';
import { compareScenarios } from './compare';

describe('AU income tax (FY2025-26 brackets)', () => {
  it('zero for income below tax-free threshold', () => {
    expect(calculateAnnualTax(18_000)).toBe(0);
  });

  it('charges 16% on income between $18,200 and $45,000', () => {
    // $30k taxable: (30000 - 18200) * 0.16 = 1888. Plus Medicare 2% * 30000 = 600
    expect(calculateAnnualTax(30_000)).toBeCloseTo(1_888 + 600, 0);
  });

  it('charges correct tax at $100k (check marginal 30% bracket)', () => {
    // (45000 - 18200) * 0.16 + (100000 - 45000) * 0.30 = 4288 + 16500 = 20788
    // + Medicare 2000
    const expected = 4_288 + 16_500 + 2_000;
    expect(calculateAnnualTax(100_000)).toBeCloseTo(expected, 0);
  });

  it('applies top 45% bracket correctly at $250k', () => {
    // bracket 1: 4288 (0→45k)
    // bracket 2: (135000-45000)*0.30 = 27000
    // bracket 3: (190000-135000)*0.37 = 20350
    // bracket 4: (250000-190000)*0.45 = 27000
    // + Medicare 5000
    const expected = 4_288 + 27_000 + 20_350 + 27_000 + 5_000;
    expect(calculateAnnualTax(250_000)).toBeCloseTo(expected, 0);
  });

  it('take-home is gross minus tax', () => {
    const gross = 120_000;
    expect(calculateTakeHome(gross)).toBeCloseTo(gross - calculateAnnualTax(gross), 0);
  });

  it('marginal rate at $100k includes Medicare', () => {
    expect(marginalRate(100_000)).toBeCloseTo(0.30 + 0.02, 5);
  });
});

describe('FBT EV exemption', () => {
  it('BEV under LCT is exempt', () => {
    expect(isEvFbtExempt('bev', 60_000)).toBe(true);
    expect(isEvFbtExempt('bev', 91_000)).toBe(true);
  });

  it('BEV above LCT fuel-efficient threshold is NOT exempt', () => {
    expect(isEvFbtExempt('bev', 95_000)).toBe(false);
  });

  it('PHEV is no longer exempt for new leases (exemption ended 1 Apr 2025)', () => {
    expect(isEvFbtExempt('phev', 60_000)).toBe(false);
  });

  it('ICE is never exempt', () => {
    expect(isEvFbtExempt('ice', 40_000)).toBe(false);
  });
});

describe('FBT statutory method maths', () => {
  it('taxable value is 20% of GST-inclusive price', () => {
    expect(statutoryTaxableValue(60_000)).toBe(12_000);
  });

  it('ECM equals taxable value', () => {
    expect(ecmContribution(60_000)).toBe(12_000);
  });
});

describe('Lease amortisation', () => {
  it('handles zero-interest degenerately', () => {
    expect(amortisedPayment(12_000, 0, 0, 12)).toBe(1_000);
  });

  it('pays off a $10k loan over 12 months at 12% annual', () => {
    // Standard PMT calc: should be ~$888.49/mo
    expect(amortisedPayment(10_000, 0, 0.12, 12)).toBeCloseTo(888.487, 1);
  });

  it('residual percentages match ATO schedule', () => {
    expect(residualPercent(1)).toBe(0.6563);
    expect(residualPercent(5)).toBe(0.2813);
  });

  it('novated lease finance produces positive monthly payment', () => {
    const r = novatedLeaseFinance({ carPriceInclGst: 66_000, termYears: 5 });
    expect(r.monthlyFinance).toBeGreaterThan(0);
    expect(r.residualExGst).toBeGreaterThan(0);
    expect(r.financedAmount).toBeCloseTo(60_000, 0); // 66k incl GST = 60k ex GST
  });
});

describe('Scenario comparison — EV novated beats other paths', () => {
  it('EV under LCT on $120k salary: novatedEvExempt is the best scenario', () => {
    const out = compareScenarios({
      grossSalary: 120_000,
      carPriceInclGst: 65_000,
      termYears: 5,
      annualKm: 15_000,
      fuelType: 'bev',
    });
    expect(out.novatedEvExempt).not.toBeNull();
    expect(out.best).toBe('novatedEvExempt');
    expect(out.savingsVsCash).toBeGreaterThan(0);
  });

  it('ICE on $120k salary: novated with ECM still usually beats loan, may lose to cash', () => {
    const out = compareScenarios({
      grossSalary: 120_000,
      carPriceInclGst: 45_000,
      termYears: 5,
      annualKm: 15_000,
      fuelType: 'ice',
    });
    expect(out.novatedEvExempt).toBeNull(); // not eligible
    expect(out.loan.totalCost).toBeGreaterThan(out.novatedEcm.totalCost); // novated beats loan
  });

  it('EV over LCT threshold: no exemption, falls back to ECM path', () => {
    const out = compareScenarios({
      grossSalary: 150_000,
      carPriceInclGst: 120_000, // over $91,387
      termYears: 5,
      annualKm: 15_000,
      fuelType: 'bev',
    });
    expect(out.novatedEvExempt).toBeNull();
    expect(out.context.fbtExempt).toBe(false);
  });

  it('all scenarios return positive total costs', () => {
    const out = compareScenarios({
      grossSalary: 100_000,
      carPriceInclGst: 50_000,
      termYears: 4,
      annualKm: 15_000,
      fuelType: 'ice',
    });
    expect(out.novatedEcm.totalCost).toBeGreaterThan(0);
    expect(out.cash.totalCost).toBeGreaterThan(0);
    expect(out.loan.totalCost).toBeGreaterThan(0);
  });
});
