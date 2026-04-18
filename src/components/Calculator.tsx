'use client';

import { useMemo, useState } from 'react';
import { InfoIcon } from 'lucide-react';
import { CarSilhouette } from './CarSilhouette';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { compareScenarios, type CompareOutput } from '@/lib/calc/compare';
import type { FuelType } from '@/lib/calc/fbt';
import { LCT_THRESHOLD_FUEL_EFFICIENT } from '@/lib/calc/constants';
import { PRESETS } from '@/lib/presets';
import { ResultsPanel } from './ResultsPanel';

const DEFAULTS = {
  grossSalary: 120_000,
  carPrice: 58_900,
  termYears: 5,
  annualKm: 15_000,
  fuelType: 'bev' as FuelType,
};


export function Calculator() {
  const [grossSalary, setGrossSalary] = useState(DEFAULTS.grossSalary);
  const [carPrice, setCarPrice] = useState(DEFAULTS.carPrice);
  const [termYears, setTermYears] = useState(DEFAULTS.termYears);
  const [annualKm, setAnnualKm] = useState(DEFAULTS.annualKm);
  const [fuelType, setFuelType] = useState<FuelType>(DEFAULTS.fuelType);

  const salaryInvalid = grossSalary < 1;
  const carPriceInvalid = carPrice < 1;

  const results: CompareOutput = useMemo(
    () =>
      compareScenarios({
        // Clamp to 1 so downstream math doesn't divide by zero
        grossSalary: Math.max(grossSalary, 1),
        carPriceInclGst: Math.max(carPrice, 1),
        termYears,
        annualKm,
        fuelType,
      }),
    [grossSalary, carPrice, termYears, annualKm, fuelType],
  );

  const overLct = fuelType === 'bev' && carPrice > LCT_THRESHOLD_FUEL_EFFICIENT;

  const activePreset =
    PRESETS.find((p) => p.carPrice === carPrice && p.fuelType === fuelType)?.label ?? null;

  function reset() {
    setGrossSalary(DEFAULTS.grossSalary);
    setCarPrice(DEFAULTS.carPrice);
    setTermYears(DEFAULTS.termYears);
    setAnnualKm(DEFAULTS.annualKm);
    setFuelType(DEFAULTS.fuelType);
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your details</CardTitle>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground transition"
            >
              Reset to defaults
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Gross annual salary</Label>
            <div className="relative">
              <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="salary"
                type="number"
                className="pl-7"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Number(e.target.value) || 0)}
                min={30000}
                max={500000}
                step={1000}
                aria-label="Gross annual salary in dollars"
                aria-describedby="salary-hint"
              />
            </div>
            {salaryInvalid ? (
              <p className="text-xs text-destructive">Enter a salary greater than $0 to see results.</p>
            ) : (
              <p id="salary-hint" className="text-xs text-muted-foreground">Between $30,000 and $500,000</p>
            )}
          </div>

          {/* Car price + presets */}
          <div className="space-y-2">
            <Label htmlFor="car">Car price (driveaway, GST incl)</Label>
            <div className="relative">
              <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="car"
                type="number"
                className="pl-7"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value) || 0)}
                min={0}
                step={500}
                aria-label="Car price in dollars, driveaway including GST"
              />
            </div>
            {carPriceInvalid && (
              <p className="text-xs text-destructive">Enter a car price greater than $0 to see results.</p>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p) => {
                const active = activePreset === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setCarPrice(p.carPrice); setFuelType(p.fuelType); }}
                    className={`flex items-center gap-2 text-xs min-h-[44px] px-3 py-2 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-border hover:bg-accent'
                    }`}
                  >
                    <CarSilhouette variant={p.carVariant} className="w-8 h-4 shrink-0" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fuel type */}
          <div className="space-y-2">
            <Label>Fuel type</Label>
            <RadioGroup
              value={fuelType}
              onValueChange={(v) => setFuelType(v as FuelType)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2"
            >
              {(['bev', 'phev', 'ice'] as const).map((ft) => (
                <label
                  key={ft}
                  htmlFor={`ft-${ft}`}
                  className={`flex items-center justify-center gap-2 border rounded-md px-3 py-2.5 text-sm cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 ${
                    fuelType === ft ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'hover:bg-accent'
                  }`}
                >
                  <RadioGroupItem id={`ft-${ft}`} value={ft} className="sr-only" />
                  {ft === 'bev' ? 'Electric (BEV)' : ft === 'phev' ? 'Plug-in Hybrid' : 'Petrol/Diesel'}
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Term + km */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={String(termYears)} onValueChange={(v) => setTermYears(Number(v))}>
                <SelectTrigger id="term">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y} year{y > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="km">Kms / year</Label>
              <Input
                id="km"
                type="number"
                value={annualKm}
                onChange={(e) => setAnnualKm(Number(e.target.value) || 0)}
                min={0}
                max={100000}
                step={1000}
                aria-label="Annual kilometres driven"
                aria-describedby="km-hint"
              />
              <p id="km-hint" className="text-xs text-muted-foreground">Typical 10,000–25,000 km/year</p>
            </div>
          </div>

          {/* Alerts — both informational, same neutral style */}
          {overLct && (
            <Alert role="alert">
              <InfoIcon className="size-4" />
              <AlertDescription>
                This EV is over the ${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')} fuel-efficient LCT threshold —
                it does <strong>not</strong> qualify for the FBT exemption.
              </AlertDescription>
            </Alert>
          )}

          {fuelType === 'phev' && (
            <Alert role="alert">
              <InfoIcon className="size-4" />
              <AlertDescription>
                The PHEV FBT exemption ended 1 April 2025. New PHEV leases are treated as standard (no exemption).
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        <ResultsPanel results={results} termYears={termYears} />
      </div>
    </div>
  );
}
