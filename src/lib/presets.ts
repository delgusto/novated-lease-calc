/**
 * Price-tier shortcuts shown in the calculator.
 * Generic ranges — no specific models, no staleness risk.
 */
import type { FuelType } from './calc/fbt';

export const PRICE_RANGES: { label: string; subLabel: string; carPrice: number; fuelType: FuelType }[] = [
  { label: 'Budget EV',    subLabel: '~$40k', carPrice: 40_000, fuelType: 'bev' },
  { label: 'Mid-range EV', subLabel: '~$55k', carPrice: 55_000, fuelType: 'bev' },
  { label: 'Premium EV',   subLabel: '~$80k', carPrice: 80_000, fuelType: 'bev' },
  { label: 'Petrol SUV',   subLabel: '~$45k', carPrice: 45_000, fuelType: 'ice' },
];
