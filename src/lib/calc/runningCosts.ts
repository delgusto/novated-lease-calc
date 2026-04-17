import {
  RUNNING_COSTS_ANNUAL,
  PETROL_PRICE_PER_LITRE,
  AVG_FUEL_CONSUMPTION_L_PER_100KM,
  ELECTRICITY_PRICE_PER_KWH,
  AVG_EV_CONSUMPTION_KWH_PER_100KM,
} from './constants';
import type { FuelType } from './fbt';

export function annualFuelCost(fuelType: FuelType, annualKm: number): number {
  if (fuelType === 'bev') {
    return (annualKm / 100) * AVG_EV_CONSUMPTION_KWH_PER_100KM * ELECTRICITY_PRICE_PER_KWH;
  }
  if (fuelType === 'phev') {
    // Rough: assume 50% electric / 50% petrol split for average driving
    const electric =
      (annualKm / 100) * AVG_EV_CONSUMPTION_KWH_PER_100KM * ELECTRICITY_PRICE_PER_KWH * 0.5;
    const petrol =
      (annualKm / 100) * AVG_FUEL_CONSUMPTION_L_PER_100KM * PETROL_PRICE_PER_LITRE * 0.5;
    return electric + petrol;
  }
  return (annualKm / 100) * AVG_FUEL_CONSUMPTION_L_PER_100KM * PETROL_PRICE_PER_LITRE;
}

export function annualRunningCostsTotal(fuelType: FuelType, annualKm: number): {
  fuel: number;
  rego: number;
  insurance: number;
  servicing: number;
  tyres: number;
  total: number;
} {
  const bucket = fuelType === 'bev' || fuelType === 'phev'
    ? RUNNING_COSTS_ANNUAL.ev
    : RUNNING_COSTS_ANNUAL.ice;

  const fuel = annualFuelCost(fuelType, annualKm);
  const total = fuel + bucket.rego + bucket.insurance + bucket.servicing + bucket.tyres;
  return {
    fuel,
    rego: bucket.rego,
    insurance: bucket.insurance,
    servicing: bucket.servicing,
    tyres: bucket.tyres,
    total,
  };
}
