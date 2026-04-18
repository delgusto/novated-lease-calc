'use client';

import { useMemo, useState } from 'react';
import { TriangleAlertIcon } from 'lucide-react';
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
import { ResultsPanel } from './ResultsPanel';

const PRESETS: { label: string; carPrice: number; fuelType: FuelType }[] = [
  { label: 'Tesla Model 3 RWD', carPrice: 58_900, fuelType: 'bev' },
  { label: 'BYD Atto 3', carPrice: 44_499, fuelType: 'bev' },
  { label: 'Kia EV5', carPrice: 56_770, fuelType: 'bev' },
  { label: 'Toyota RAV4 Hybrid', carPrice: 45_260, fuelType: 'ice' },
];

export function Calculator() {
  const [grossSalary, setGrossSalary] = useState(120_000);
  const [carPrice, setCarPrice] = useState(58_900);
  const [termYears, setTermYears] = useState(5);
  const [annualKm, setAnnualKm] = useState(15_000);
  const [fuelType, setFuelType] = useState<FuelType>('bev');

  const results: CompareOutput = useMemo(
    () =>
      compareScenarios({
        grossSalary,
        carPriceInclGst: carPrice,
        termYears,
        annualKm,
        fuelType,
      }),
    [grossSalary, carPrice, termYears, annualKm, fuelType],
  );

  const overLct = fuelType === 'bev' && carPrice > LCT_THRESHOLD_FUEL_EFFICIENT;

  // Derived — no extra state: clears automatically when user edits price or fuel type
  const activePreset = PRESETS.find(
    (p) => p.carPrice === carPrice && p.fuelType === fuelType,
  )?.label ?? null;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
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
            <p id="salary-hint" className="text-xs text-muted-foreground">Between $30,000 and $500,000</p>
          </div>

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
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setCarPrice(p.carPrice);
                    setFuelType(p.fuelType);
                  }}
                  className={`text-xs min-h-[40px] px-3 py-2 rounded-full border transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
                    activePreset === p.label
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fuel type</Label>
            <RadioGroup
              value={fuelType}
              onValueChange={(v) => setFuelType(v as FuelType)}
              className="grid grid-cols-3 gap-2"
            >
              {(['bev', 'phev', 'ice'] as const).map((ft) => (
                <label
                  key={ft}
                  htmlFor={`ft-${ft}`}
                  className={`flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:outline-none ${
                    fuelType === ft ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'hover:bg-accent'
                  }`}
                >
                  <RadioGroupItem id={`ft-${ft}`} value={ft} className="sr-only" />
                  {ft === 'bev' ? 'Electric (BEV)' : ft === 'phev' ? 'Plug-in Hybrid' : 'Petrol/Diesel'}
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select
                value={String(termYears)}
                onValueChange={(v) => setTermYears(Number(v))}
              >
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

          {overLct && (
            <Alert variant="destructive">
              <TriangleAlertIcon />
              <AlertDescription>
                This EV is over the ${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')} luxury-car-tax threshold,
                so it does <strong>not</strong> qualify for the FBT exemption.
              </AlertDescription>
            </Alert>
          )}

          {fuelType === 'phev' && (
            <Alert>
              <AlertDescription>
                The PHEV FBT exemption ended 1 April 2025. New PHEV leases are treated as standard (no
                exemption).
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
