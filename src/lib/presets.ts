/**
 * Preset car options shown in the calculator.
 *
 * Review every June — driveaway prices change with manufacturer updates,
 * model year revisions, and currency fluctuations. Verify on carsales.com.au
 * or manufacturer sites before updating. Prices are driveaway, GST-inclusive.
 */
import type { FuelType } from './calc/fbt';

export const PRESETS: { label: string; carPrice: number; fuelType: FuelType }[] = [
  { label: 'Tesla Model 3 RWD', carPrice: 58_900, fuelType: 'bev' },
  { label: 'BYD Atto 3',        carPrice: 44_499, fuelType: 'bev' },
  { label: 'Kia EV5',           carPrice: 56_770, fuelType: 'bev' },
  { label: 'Toyota RAV4 Hybrid',carPrice: 45_260, fuelType: 'ice' },
];
