import {
  FBT_RATE,
  FBT_GROSS_UP_TYPE_1,
  FBT_STATUTORY_RATE,
  LCT_THRESHOLD_FUEL_EFFICIENT,
} from './constants';

export type FuelType = 'ice' | 'bev' | 'phev';

/**
 * FBT exemption eligibility for zero/low-emission vehicles under s8A FBTAA.
 *
 * Rules (as of FY2025-26):
 * - Vehicle must be first held & used after 1 July 2022.
 * - Price at or below LCT threshold for fuel-efficient vehicles.
 * - BEV and hydrogen fuel cell: always eligible if price OK.
 * - PHEV: exemption ENDED 1 April 2025 for new leases. Existing leases grandfathered.
 *   For any NEW lease in FY2025-26, PHEV is NOT exempt.
 * - ICE: never exempt.
 */
export function isEvFbtExempt(fuelType: FuelType, carPriceInclGst: number): boolean {
  if (fuelType === 'ice') return false;
  if (fuelType === 'phev') return false; // exemption ended 1 Apr 2025
  if (fuelType === 'bev') {
    return carPriceInclGst <= LCT_THRESHOLD_FUEL_EFFICIENT;
  }
  return false;
}

/**
 * FBT statutory taxable value — flat 20% of GST-inclusive car price annually.
 */
export function statutoryTaxableValue(carPriceInclGst: number): number {
  return carPriceInclGst * FBT_STATUTORY_RATE;
}

/**
 * Annual FBT liability to the employer if no ECM contribution is made.
 * Grossed-up because the car is GST-creditable (Type 1 gross-up = 2.0802).
 */
export function annualFbtLiability(carPriceInclGst: number): number {
  return statutoryTaxableValue(carPriceInclGst) * FBT_GROSS_UP_TYPE_1 * FBT_RATE;
}

/**
 * Employee Contribution Method — employee pays the taxable value from POST-tax
 * income. This reduces the FBT taxable value to $0 → no FBT payable.
 * Returns the annual post-tax contribution required.
 */
export function ecmContribution(carPriceInclGst: number): number {
  return statutoryTaxableValue(carPriceInclGst);
}
