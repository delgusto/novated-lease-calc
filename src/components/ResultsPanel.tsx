'use client';

import { Card, CardContent } from '@/components/ui/card';
import { aud } from '@/lib/format';
import type { CompareOutput, ScenarioResult } from '@/lib/calc/compare';

function ScenarioCard({
  result,
  highlight,
  termYears,
  tag,
}: {
  result: ScenarioResult;
  highlight: boolean;
  termYears: number;
  tag?: string;
}) {
  return (
    <div
      className={`rounded-lg border p-4 relative ${
        highlight
          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
          : 'border-border'
      }`}
    >
      {highlight && (
        <span className="absolute -top-2 left-3 text-[10px] tracking-wider uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">
          Best deal
        </span>
      )}
      {tag && !highlight && (
        <span className="absolute -top-2 left-3 text-[10px] tracking-wider uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded">
          {tag}
        </span>
      )}
      <div className="text-sm font-medium text-muted-foreground">{result.label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums">
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
          <div className="text-emerald-700 pt-1">✓ You own the car at end</div>
        ) : (
          <div className="pt-1">Residual due: {aud.format(result.breakdown.resaleAtEnd)}</div>
        )}
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

  return (
    <Card className="h-full">
      <CardContent className="pt-6 space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Your best option</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tabular-nums">
              {aud.format(savingsVsCash)}
            </span>
            <span className="text-sm text-muted-foreground">
              saved over {termYears} years vs paying cash
            </span>
          </div>
          {novatedEvExempt && best === 'novatedEvExempt' && (
            <p className="text-sm mt-2 text-emerald-700">
              An EV novated lease is your best path — the FBT exemption means 100% of the package comes out of
              your pre-tax salary.
            </p>
          )}
          {!novatedEvExempt && best === 'novatedEcm' && (
            <p className="text-sm mt-2 text-emerald-700">
              A standard novated lease with ECM offset still beats cash or a car loan on this car.
            </p>
          )}
          {best === 'cash' && (
            <p className="text-sm mt-2">
              On the numbers, paying cash is cheapest overall — but you lose the cash flow and flexibility of a lease.
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {novatedEvExempt && (
            <ScenarioCard
              result={novatedEvExempt}
              highlight={best === 'novatedEvExempt'}
              termYears={termYears}
              tag="FBT exempt"
            />
          )}
          <ScenarioCard
            result={novatedEcm}
            highlight={best === 'novatedEcm'}
            termYears={termYears}
            tag={novatedEvExempt ? 'Without exemption' : 'Standard novated'}
          />
          <ScenarioCard
            result={cash}
            highlight={best === 'cash'}
            termYears={termYears}
          />
          <ScenarioCard
            result={loan}
            highlight={best === 'loan'}
            termYears={termYears}
          />
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed pt-2">
          Estimates only. Assumes FY2025-26 tax rates, 8.5% lease rate, 8.9% car loan rate, ATO minimum residual at end
          of term, and average AU running costs. Real provider quotes will vary — get a quote below for an exact number.
        </p>
      </CardContent>
    </Card>
  );
}
