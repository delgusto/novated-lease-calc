/**
 * AU tax & lease constants for FY2025-26.
 * Review every June — ATO brackets, LCT threshold, and FBT rates change.
 */

export const FINANCIAL_YEAR = '2025-26';

// Resident individual income tax (2024-25 rates, still applicable FY2025-26)
export const TAX_BRACKETS = [
  { threshold: 0, rate: 0 },
  { threshold: 18_200, rate: 0.16 },
  { threshold: 45_000, rate: 0.30 },
  { threshold: 135_000, rate: 0.37 },
  { threshold: 190_000, rate: 0.45 },
] as const;

// Medicare levy (simplified — ignores low-income rebate and surcharge).
export const MEDICARE_LEVY_RATE = 0.02;
export const MEDICARE_LEVY_THRESHOLD = 26_000;

// FBT
export const FBT_RATE = 0.47;
export const FBT_GROSS_UP_TYPE_1 = 2.0802; // GST-creditable (most novated leases)
export const FBT_STATUTORY_RATE = 0.20;

// Luxury Car Tax threshold for fuel-efficient vehicles (FY2025-26).
// Only BEVs priced AT or BELOW this qualify for the FBT EV exemption.
export const LCT_THRESHOLD_FUEL_EFFICIENT = 91_387;

// ATO minimum residual values for motor-vehicle operating leases (percentage of vehicle cost).
export const RESIDUAL_VALUES: Record<number, number> = {
  1: 0.6563,
  2: 0.5625,
  3: 0.4688,
  4: 0.3750,
  5: 0.2813,
};

// GST
export const GST_RATE = 0.10;

// Novated lease assumptions (sensible defaults; users can override in "advanced")
export const DEFAULT_LEASE_INTEREST_RATE = 0.085; // 8.5% p.a.
export const DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL = 660; // typical admin fee

// Car loan rate (unsecured/secured consumer rate, typical AU)
export const DEFAULT_CAR_LOAN_RATE = 0.089; // 8.9% p.a.

// Fuel / electricity price assumptions (AU national avg).
export const PETROL_PRICE_PER_LITRE = 1.95; // AUD
export const AVG_FUEL_CONSUMPTION_L_PER_100KM = 8.5; // ICE sedan/SUV avg
export const ELECTRICITY_PRICE_PER_KWH = 0.32; // AUD, home charging mix
export const AVG_EV_CONSUMPTION_KWH_PER_100KM = 17;

// Annual non-fuel running-cost defaults (AUD, averages).
export const RUNNING_COSTS_ANNUAL = {
  ice: {
    rego: 800,        // incl CTP — varies heavily by state
    insurance: 1_400,
    servicing: 900,
    tyres: 400,       // amortised
  },
  ev: {
    rego: 700,
    insurance: 1_600, // slightly higher — panel/battery repair
    servicing: 400,   // fewer moving parts
    tyres: 500,       // heavier cars wear tyres faster
  },
} as const;
