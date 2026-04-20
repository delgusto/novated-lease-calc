'use client';

import { useMemo, useState } from 'react';
import { ZapIcon, GaugeIcon } from 'lucide-react';
import { compareScenarios, type CompareOutput } from '@/lib/calc/compare';
import type { FuelType } from '@/lib/calc/fbt';
import { LCT_THRESHOLD_FUEL_EFFICIENT } from '@/lib/calc/constants';
import { PRICE_RANGES } from '@/lib/presets';
import { ResultsPanel } from './ResultsPanel';

const DEFAULTS = {
  grossSalary: 120_000,
  carPrice: 58_900,
  termYears: 5,
  annualKm: 15_000,
  fuelType: 'bev' as FuelType,
};

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
  prefix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="nl-field">
      <div className="nl-field-row">
        <label className="nl-field-label">{label}</label>
        <div className="nl-field-value">
          {prefix && <span className="nl-field-prefix">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onFocus={(e) => e.target.select()}
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
            className="nl-field-num"
          />
        </div>
      </div>
      <div className="nl-slider-wrap">
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nl-slider"
          style={{ '--nl-pct': `${pct}%` } as React.CSSProperties}
        />
      </div>
      {hint && <div className="nl-field-hint">{hint}</div>}
    </div>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="nl-seg" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`nl-seg-btn${value === o.value ? ' nl-seg-btn-on' : ''}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function YearStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="nl-seg nl-seg-5" role="radiogroup" aria-label="Lease term in years">
      {[1, 2, 3, 4, 5].map((y) => (
        <button
          key={y}
          type="button"
          role="radio"
          aria-checked={value === y}
          onClick={() => onChange(y)}
          className={`nl-seg-btn${value === y ? ' nl-seg-btn-on' : ''}`}
        >
          {y}yr
        </button>
      ))}
    </div>
  );
}

export function Calculator() {
  const [grossSalary, setGrossSalary] = useState(DEFAULTS.grossSalary);
  const [carPrice, setCarPrice] = useState(DEFAULTS.carPrice);
  const [termYears, setTermYears] = useState(DEFAULTS.termYears);
  const [annualKm, setAnnualKm] = useState(DEFAULTS.annualKm);
  const [fuelType, setFuelType] = useState<FuelType>(DEFAULTS.fuelType);

  const results: CompareOutput = useMemo(
    () =>
      compareScenarios({
        grossSalary: Math.max(grossSalary, 1),
        carPriceInclGst: Math.max(carPrice, 1),
        termYears,
        annualKm,
        fuelType,
      }),
    [grossSalary, carPrice, termYears, annualKm, fuelType],
  );

  const overLct = fuelType === 'bev' && carPrice > LCT_THRESHOLD_FUEL_EFFICIENT;

  function reset() {
    setGrossSalary(DEFAULTS.grossSalary);
    setCarPrice(DEFAULTS.carPrice);
    setTermYears(DEFAULTS.termYears);
    setAnnualKm(DEFAULTS.annualKm);
    setFuelType(DEFAULTS.fuelType);
  }

  return (
    <div className="nl-calc">
      {/* LEFT: inputs */}
      <div className="nl-calc-inputs">
        <div className="nl-inputs-head">
          <span className="nl-eyebrow">Your situation</span>
          <button type="button" className="nl-link-btn" onClick={reset}>
            Reset
          </button>
        </div>

        <SliderField
          label="Gross annual salary"
          value={grossSalary}
          onChange={setGrossSalary}
          min={40000}
          max={350000}
          step={1000}
          prefix="$"
          hint="Before tax · AU resident"
        />

        <SliderField
          label="Car price (driveaway, GST incl.)"
          value={carPrice}
          onChange={setCarPrice}
          min={15000}
          max={150000}
          step={500}
          prefix="$"
          hint={
            overLct
              ? `Over the $${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')} price cap — this car doesn't qualify for the tax exemption`
              : `Tax exemption price cap: $${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')}`
          }
        />

        <div className="nl-field">
          <label className="nl-field-label">Fuel type</label>
          <Segmented
            value={fuelType}
            onChange={(v) => setFuelType(v as FuelType)}
            options={[
              { value: 'bev', label: 'Electric' },
              { value: 'phev', label: 'Plug-in Hybrid' },
              { value: 'ice', label: 'Petrol / Diesel' },
            ]}
          />
        </div>

        <div className="nl-field">
          <label className="nl-field-label">Lease term</label>
          <YearStepper value={termYears} onChange={setTermYears} />
        </div>

        <SliderField
          label="Kms per year"
          value={annualKm}
          onChange={setAnnualKm}
          min={5000}
          max={40000}
          step={1000}
          hint="Typical 10–25k"
        />

        {overLct && (
          <div className="nl-alert" role="alert">
            <span className="nl-alert-ico" aria-hidden="true">!</span>
            <div>
              This EV is over the{' '}
              <strong>${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')}</strong> price cap — it does{' '}
              <strong>not</strong> qualify for the tax exemption.
            </div>
          </div>
        )}
        {fuelType === 'phev' && (
          <div className="nl-alert" role="alert">
            <span className="nl-alert-ico" aria-hidden="true">!</span>
            <div>
              The plug-in hybrid tax exemption ended <strong>1 April 2025</strong>. New plug-in hybrid leases
              are treated the same as petrol cars (no exemption).
            </div>
          </div>
        )}

        <div className="nl-examples">
          <div className="nl-examples-head">
            <span className="nl-eyebrow">Try a common scenario</span>
            <span className="nl-examples-note">Examples only · we don&apos;t sell cars</span>
          </div>
          <div className="nl-ex-list">
            {PRICE_RANGES.map((p) => (
              <button
                key={p.label}
                type="button"
                className="nl-ex-item"
                onClick={() => {
                  setCarPrice(p.carPrice);
                  setFuelType(p.fuelType);
                }}
              >
                <span className="nl-ex-ico">
                  {p.fuelType === 'bev' ? <ZapIcon size={18} /> : <GaugeIcon size={18} />}
                </span>
                <span className="nl-ex-body">
                  <span className="nl-ex-name">{p.label}</span>
                  <span className="nl-ex-meta">{p.subLabel}</span>
                </span>
                <span className="nl-ex-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: results */}
      <ResultsPanel results={results} termYears={termYears} />
    </div>
  );
}
