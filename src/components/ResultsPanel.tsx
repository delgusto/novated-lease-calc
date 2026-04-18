'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { aud } from '@/lib/format';
import type { CompareOutput, ScenarioResult } from '@/lib/calc/compare';
import {
  DEFAULT_LEASE_INTEREST_RATE,
  DEFAULT_CAR_LOAN_RATE,
  DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL,
  PETROL_PRICE_PER_LITRE,
  ELECTRICITY_PRICE_PER_KWH,
} from '@/lib/calc/constants';

type BreakdownRow = { label: string; value: string; credit?: boolean };

function getBreakdownRows(breakdown: Record<string, number>): BreakdownRow[] {
  const rows: BreakdownRow[] = [];

  if ('annualPackageDeduction' in breakdown) {
    rows.push({ label: 'Annual pre-tax package', value: `${aud.format(breakdown.annualPackageDeduction)}/yr` });
  }
  if ('postTaxEcmContribution' in breakdown && breakdown.postTaxEcmContribution > 0) {
    rows.push({ label: 'Employee contribution (FBT offset)', value: `${aud.format(breakdown.postTaxEcmContribution)}/yr` });
  }
  if ('reducedTakeHome' in breakdown) {
    rows.push({ label: 'Net take-home reduction', value: `${aud.format(breakdown.reducedTakeHome)}/yr` });
  }
  if ('upfront' in breakdown) {
    rows.push({ label: 'Purchase price (day 1)', value: aud.format(breakdown.upfront) });
  }
  if ('annualRepayment' in breakdown) {
    rows.push({ label: 'Annual loan repayments', value: `${aud.format(breakdown.annualRepayment)}/yr` });
  }
  if ('totalInterest' in breakdown) {
    rows.push({ label: 'Total interest paid', value: aud.format(breakdown.totalInterest) });
  }
  if ('annualRunningCosts' in breakdown) {
    rows.push({ label: 'Running costs (fuel, rego, service)', value: `${aud.format(breakdown.annualRunningCosts)}/yr` });
  }
  if ('resaleAtEnd' in breakdown) {
    const isCashOrLoan = 'upfront' in breakdown || 'annualRepayment' in breakdown;
    rows.push({
      label: isCashOrLoan ? 'Estimated resale value' : 'Balloon payment (to keep car)',
      value: `−${aud.format(breakdown.resaleAtEnd)}`,
      credit: true,
    });
  }

  return rows;
}

function ScenarioCard({
  result,
  highlight,
  termYears,
  tag,
  expanded,
  onToggle,
}: {
  result: ScenarioResult;
  highlight: boolean;
  termYears: number;
  tag?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const breakdownRows = getBreakdownRows(result.breakdown);

  return (
    <div
      className={`rounded-lg border overflow-hidden transition-all ${
        highlight
          ? 'border-2 border-emerald-600 bg-emerald-50 shadow-sm'
          : 'border-border opacity-90'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`text-sm font-medium ${highlight ? 'text-emerald-900' : 'text-muted-foreground'}`}>
            {result.label}
          </div>
          {highlight ? (
            <span className="text-xs tracking-wider uppercase bg-emerald-800 text-white px-2 py-0.5 rounded shrink-0">
              Best deal
            </span>
          ) : tag ? (
            <span
              className="text-xs tracking-wider uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded shrink-0"
              title={
                tag === 'No FBT'
                  ? 'FBT exemption applies — 100% of the package is pre-tax. No Employee Contribution needed.'
                  : tag === 'Standard rates'
                  ? 'No FBT exemption on this car. ECM post-tax contributions offset the FBT liability.'
                  : undefined
              }
            >
              {tag}
            </span>
          ) : null}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`${highlight ? 'text-3xl font-bold' : 'text-2xl font-semibold'} tabular-nums`}>
            {aud.format(result.weeklyNetCost)}
          </span>
          <span className="text-xs text-muted-foreground">/week</span>
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Annual net cost</span>
            <span className="tabular-nums text-foreground">{aud.format(result.annualNetCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>{termYears}-year total</span>
            <span className="tabular-nums text-foreground">{aud.format(result.totalCost)}</span>
          </div>
          {result.ownsCar ? (
            <div className={`pt-1 ${highlight ? 'text-emerald-700' : ''}`}>✓ You own the car at end</div>
          ) : (
            <div className="pt-1">
              <span
                className="cursor-help underline decoration-dotted decoration-muted-foreground"
                title="The ATO-prescribed minimum you pay at lease end to keep the car. On a 5-year lease, typically 28% of the ex-GST price. You can also refinance it into a new lease or hand the car back."
              >
                Balloon payment to keep car
              </span>
              : {aud.format(result.breakdown.resaleAtEnd)}
            </div>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className={`w-full flex items-center justify-center gap-1 py-2 text-xs border-t transition-colors ${
          highlight
            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <ChevronDownIcon
          className={`size-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
        {expanded ? 'Hide breakdown' : 'Show breakdown'}
      </button>

      {/* Breakdown panel — animates open/close via grid trick */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-4 py-3 space-y-1.5 border-t text-xs ${highlight ? 'border-emerald-200' : 'border-border'}`}>
            {breakdownRows.map(({ label, value, credit }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className={credit ? 'text-muted-foreground' : ''}>{label}</span>
                <span className={`tabular-nums shrink-0 ${credit ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsPanel({
  results,
  termYears,
}: {
  results: CompareOutput;
  termYears: number;
}) {
  const { novatedEvExempt, novatedEcm, cash, loan, best, savingsVsCash } = results;
  const hasSaving = savingsVsCash > 0;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  function toggleCard(id: string) {
    setExpandedCard((prev) => (prev === id ? null : id));
  }

  return (
    <Card className="h-full">
      <CardContent className="pt-6 space-y-6" aria-live="polite" aria-atomic="true">

        {/* Hero savings */}
        <div>
          <p className="text-base font-semibold text-foreground">Your best option</p>
          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            {hasSaving ? (
              <>
                <span className="text-5xl font-semibold tabular-nums">
                  {aud.format(savingsVsCash)}
                </span>
                <span className="text-sm text-muted-foreground">
                  saved over {termYears} years vs paying cash
                </span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-muted-foreground">
                Cash is cheapest on these numbers
              </span>
            )}
          </div>
          {hasSaving && novatedEvExempt && best === 'novatedEvExempt' && (
            <p className="text-sm mt-2 text-emerald-700">
              An EV novated lease is your best path — the FBT exemption means 100% of the package comes
              out of your pre-tax salary.
            </p>
          )}
          {hasSaving && !novatedEvExempt && best === 'novatedEcm' && (
            <p className="text-sm mt-2 text-emerald-700">
              A standard novated lease still beats cash or a car loan for this car and salary.
            </p>
          )}
          {best === 'cash' && (
            <p className="text-sm mt-2 text-muted-foreground">
              The FBT overhead or interest costs outweigh the tax advantage here — this is common with
              cheaper ICE cars or lower salaries. Try the Tesla Model 3 preset to see the EV difference.
            </p>
          )}
        </div>

        {/* Scenario cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {novatedEvExempt && (
            <ScenarioCard
              result={novatedEvExempt}
              highlight={best === 'novatedEvExempt'}
              termYears={termYears}
              tag="No FBT"
              expanded={expandedCard === 'novatedEvExempt'}
              onToggle={() => toggleCard('novatedEvExempt')}
            />
          )}
          <ScenarioCard
            result={novatedEcm}
            highlight={best === 'novatedEcm'}
            termYears={termYears}
            tag={novatedEvExempt ? 'Standard rates' : undefined}
            expanded={expandedCard === 'novatedEcm'}
            onToggle={() => toggleCard('novatedEcm')}
          />
          <ScenarioCard
            result={cash}
            highlight={best === 'cash'}
            termYears={termYears}
            expanded={expandedCard === 'cash'}
            onToggle={() => toggleCard('cash')}
          />
          <ScenarioCard
            result={loan}
            highlight={best === 'loan'}
            termYears={termYears}
            expanded={expandedCard === 'loan'}
            onToggle={() => toggleCard('loan')}
          />
        </div>

        {/* Disclaimer + expandable assumptions */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed pt-2">
            Estimates only. Real provider quotes will vary — get a quote below for exact numbers.
          </p>
          <details className="group">
            <summary className="text-xs text-muted-foreground cursor-pointer list-none flex items-center gap-1 hover:text-foreground w-fit select-none">
              <ChevronDownIcon className="size-3 transition-transform group-open:rotate-180" />
              What&apos;s assumed in these estimates?
            </summary>
            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground border-l-2 border-border pl-3">
              <div className="flex justify-between gap-4">
                <span>Novated lease rate</span>
                <span className="tabular-nums text-foreground">{(DEFAULT_LEASE_INTEREST_RATE * 100).toFixed(1)}% p.a.</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Car loan rate</span>
                <span className="tabular-nums text-foreground">{(DEFAULT_CAR_LOAN_RATE * 100).toFixed(1)}% p.a.</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Fleet management fee</span>
                <span className="tabular-nums text-foreground">${DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL}/yr</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Petrol price</span>
                <span className="tabular-nums text-foreground">${PETROL_PRICE_PER_LITRE}/L (AU avg)</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Electricity (home charging)</span>
                <span className="tabular-nums text-foreground">${ELECTRICITY_PRICE_PER_KWH}/kWh</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Balloon / residual</span>
                <span className="text-foreground">ATO minimum (28.13% on 5yr)</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Tax rates</span>
                <span className="text-foreground">FY2025-26</span>
              </div>
            </div>
          </details>
        </div>

      </CardContent>
    </Card>
  );
}
