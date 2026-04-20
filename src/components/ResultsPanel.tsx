'use client';

import { useState } from 'react';
import { aud } from '@/lib/format';
import type { CompareOutput, ScenarioResult } from '@/lib/calc/compare';
import {
  DEFAULT_LEASE_INTEREST_RATE,
  DEFAULT_CAR_LOAN_RATE,
  DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL,
  PETROL_PRICE_PER_LITRE,
  ELECTRICITY_PRICE_PER_KWH,
} from '@/lib/calc/constants';

function fmtAbs(n: number) {
  return aud.format(Math.round(Math.abs(n)));
}

function yearlyTotals(scenario: ScenarioResult, years: number): { year: number; total: number }[] {
  const out: { year: number; total: number }[] = [{ year: 0, total: 0 }];
  for (let y = 1; y <= years; y++) {
    if ('upfront' in scenario.breakdown) {
      const up = scenario.breakdown.upfront;
      const run = scenario.breakdown.annualRunningCosts;
      const resale = scenario.breakdown.resaleAtEnd;
      out.push({ year: y, total: up + run * y - (y === years ? resale : 0) });
    } else {
      const annual = scenario.annualNetCost;
      const resale = scenario.breakdown.resaleAtEnd ?? 0;
      out.push({ year: y, total: annual * y - (y === years ? resale : 0) });
    }
  }
  return out;
}

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
    rows.push({ label: 'Running costs', value: `${aud.format(breakdown.annualRunningCosts)}/yr` });
  }
  if ('resaleAtEnd' in breakdown) {
    const isCashOrLoan = 'upfront' in breakdown || 'annualRepayment' in breakdown;
    rows.push({
      label: isCashOrLoan ? 'Estimated resale value' : 'Balloon payment (to keep car)',
      value: `−${fmtAbs(breakdown.resaleAtEnd)}`,
      credit: true,
    });
  }
  return rows;
}

const LINE_COLORS = [
  'oklch(55% 0.08 260)',
  'oklch(55% 0.11 30)',
  'oklch(55% 0.08 310)',
  'oklch(55% 0.10 80)',
];

function WeeklyBars({
  scenarios,
  best,
}: {
  scenarios: ScenarioResult[];
  best: ScenarioResult;
}) {
  const max = Math.max(...scenarios.map((s) => s.weeklyNetCost));
  return (
    <div className="nl-chart nl-chart-bars">
      <div className="nl-chart-title">Weekly net cost</div>
      <div className="nl-bars">
        {scenarios.map((s) => {
          const w = (s.weeklyNetCost / max) * 100;
          const isBest = s === best;
          return (
            <div key={s.label} className="nl-bar-row">
              <span className="nl-bar-label">{s.label}</span>
              <div className="nl-bar-track">
                <div
                  className={`nl-bar-fill${isBest ? ' nl-bar-best' : ''}`}
                  style={{ width: `${w}%` }}
                />
                <span className="nl-bar-num">
                  {fmtAbs(s.weeklyNetCost)}
                  <span className="nl-bar-unit">/wk</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CumulativeChart({
  scenarios,
  best,
  years,
}: {
  scenarios: ScenarioResult[];
  best: ScenarioResult;
  years: number;
}) {
  const W = 560,
    H = 220,
    pad = { l: 48, r: 16, t: 20, b: 28 };
  const lines = scenarios.map((s) => ({ scenario: s, points: yearlyTotals(s, years) }));
  const allTotals = lines.flatMap((l) => l.points.map((p) => p.total));
  const maxY = Math.max(...allTotals) * 1.05;
  const minY = Math.min(0, ...allTotals);
  const sx = (x: number) => pad.l + (x / years) * (W - pad.l - pad.r);
  const sy = (y: number) =>
    pad.t + (1 - (y - minY) / (maxY - minY)) * (H - pad.t - pad.b);

  const gridStep = Math.ceil(maxY / 4 / 10000) * 10000;
  const gridY: number[] = [];
  for (let v = 0; v <= maxY; v += gridStep) gridY.push(v);

  return (
    <div className="nl-chart nl-chart-line">
      <div className="nl-chart-title">
        Cumulative cost over {years} {years > 1 ? 'years' : 'year'}
        <span className="nl-chart-sub">Lower is better · net of resale/balloon</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="nl-line-svg" preserveAspectRatio="none">
        {gridY.map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={sy(v)}
              y2={sy(v)}
              className="nl-grid-line"
            />
            <text x={pad.l - 8} y={sy(v) + 3} textAnchor="end" className="nl-axis-lbl">
              {v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`}
            </text>
          </g>
        ))}
        {Array.from({ length: years + 1 }).map((_, i) => (
          <text key={i} x={sx(i)} y={H - 10} textAnchor="middle" className="nl-axis-lbl">
            {i === 0 ? 'Today' : `Yr ${i}`}
          </text>
        ))}
        {lines.map((l, idx) => {
          const isBest = l.scenario === best;
          const color = isBest ? 'var(--nl-accent)' : LINE_COLORS[idx % LINE_COLORS.length];
          const d = l.points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.year)} ${sy(p.total)}`)
            .join(' ');
          return (
            <g key={idx}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={isBest ? 2.8 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isBest ? 1 : 0.75}
              />
              {l.points.map((p, i) => (
                <circle
                  key={i}
                  cx={sx(p.year)}
                  cy={sy(p.total)}
                  r={isBest ? 3.5 : 2.5}
                  fill={color}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="nl-legend">
        {lines.map((l, idx) => {
          const isBest = l.scenario === best;
          const color = isBest ? 'var(--nl-accent)' : LINE_COLORS[idx % LINE_COLORS.length];
          return (
            <div key={idx} className="nl-legend-item">
              <span className="nl-legend-swatch" style={{ background: color }} />
              <span className="nl-legend-lbl">{l.scenario.label}</span>
              <span className="nl-legend-total">{fmtAbs(l.scenario.totalCost)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScenarioRow({
  result,
  best,
  expanded,
  onToggle,
  termYears,
}: {
  result: ScenarioResult;
  best: ScenarioResult;
  expanded: boolean;
  onToggle: () => void;
  termYears: number;
}) {
  const isBest = result === best;
  const diff = result.totalCost - best.totalCost;
  const rows = getBreakdownRows(result.breakdown);

  return (
    <div className={`nl-scen${isBest ? ' nl-scen-best' : ''}`}>
      <button
        type="button"
        className="nl-scen-head"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <div className="nl-scen-meta">
          <div className="nl-scen-label-row">
            <span className="nl-scen-label">{result.label}</span>
            {isBest && <span className="nl-pill nl-pill-best">Best path</span>}
          </div>
          <div className="nl-scen-sub">
            {result.ownsCar ? 'You own the car at term end' : 'Pay residual to keep, or refinance'}
          </div>
        </div>
        <div className="nl-scen-nums">
          <div className="nl-scen-weekly">
            <span className="nl-weekly-num">{fmtAbs(result.weeklyNetCost)}</span>
            <span className="nl-weekly-unit">/wk</span>
          </div>
          <div className="nl-scen-delta">
            {isBest ? (
              <span className="nl-delta-best">lowest total</span>
            ) : (
              <span className="nl-delta-up">
                +{fmtAbs(diff)} more over {termYears}y
              </span>
            )}
          </div>
        </div>
        <svg
          className={`nl-chev${expanded ? ' nl-chev-open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5 9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`nl-scen-body${expanded ? ' nl-scen-body-open' : ''}`}>
        <div className="nl-scen-body-inner">
          <div className="nl-scen-body-content">
            {rows.map(({ label, value, credit }) => (
              <div key={label} className="nl-brk-row">
                <span className="nl-brk-label" style={credit ? { opacity: 0.65 } : undefined}>
                  {label}
                </span>
                <span className="nl-brk-val" style={credit ? { opacity: 0.65 } : undefined}>
                  {value}
                </span>
              </div>
            ))}
            <div className="nl-brk-row nl-brk-total">
              <span className="nl-brk-label">Net cost over {termYears} years</span>
              <span className="nl-brk-val">{fmtAbs(result.totalCost)}</span>
            </div>
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [view, setView] = useState<'cards' | 'chart'>('cards');

  const allScenarios = [novatedEvExempt, novatedEcm, cash, loan]
    .filter((s): s is ScenarioResult => s !== null)
    .sort((a, b) => a.totalCost - b.totalCost);

  const bestScenario =
    allScenarios.find(
      (s) =>
        (best === 'novatedEvExempt' && s === novatedEvExempt) ||
        (best === 'novatedEcm' && s === novatedEcm) ||
        (best === 'cash' && s === cash) ||
        (best === 'loan' && s === loan),
    ) ?? allScenarios[0];

  function toggleCard(id: string) {
    setExpandedCard((prev) => (prev === id ? null : id));
  }

  return (
    <div className="nl-calc-results" aria-live="polite" aria-atomic="true">
      <div className="nl-results-head">
        <div>
          <div className="nl-eyebrow">Result</div>
          <div className="nl-headline">
            {savingsVsCash > 0 ? (
              <>
                <span className="nl-headline-num">{fmtAbs(savingsVsCash)}</span>
                <span className="nl-headline-sub">
                  saved over {termYears} {termYears > 1 ? 'years' : 'year'} vs cash
                </span>
              </>
            ) : (
              <>
                <span className="nl-headline-num nl-headline-flat">Cash wins here</span>
                <span className="nl-headline-sub">
                  the tax advantage doesn&apos;t cover the overhead on these numbers
                </span>
              </>
            )}
          </div>
        </div>
        <div className="nl-view-toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'cards'}
            onClick={() => setView('cards')}
            className={view === 'cards' ? 'on' : ''}
          >
            List
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'chart'}
            onClick={() => setView('chart')}
            className={view === 'chart' ? 'on' : ''}
          >
            Charts
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="nl-scen-list">
          {allScenarios.map((s) => (
            <ScenarioRow
              key={s.label}
              result={s}
              best={bestScenario}
              termYears={termYears}
              expanded={expandedCard === s.label}
              onToggle={() => toggleCard(s.label)}
            />
          ))}
        </div>
      ) : (
        <div className="nl-charts">
          <WeeklyBars scenarios={allScenarios} best={bestScenario} />
          <CumulativeChart scenarios={allScenarios} best={bestScenario} years={termYears} />
        </div>
      )}

      <details className="nl-assumptions">
        <summary>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M3 4.5L6 7.5 9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          What&apos;s assumed in these numbers?
        </summary>
        <div className="nl-assump-body">
          <div className="nl-assump-row">
            <span>Novated lease rate</span>
            <span>{(DEFAULT_LEASE_INTEREST_RATE * 100).toFixed(1)}% p.a.</span>
          </div>
          <div className="nl-assump-row">
            <span>Car loan rate</span>
            <span>{(DEFAULT_CAR_LOAN_RATE * 100).toFixed(1)}% p.a.</span>
          </div>
          <div className="nl-assump-row">
            <span>Fleet management fee</span>
            <span>${DEFAULT_FLEET_MANAGEMENT_FEE_ANNUAL}/yr</span>
          </div>
          <div className="nl-assump-row">
            <span>Petrol</span>
            <span>${PETROL_PRICE_PER_LITRE}/L (AU avg)</span>
          </div>
          <div className="nl-assump-row">
            <span>Electricity</span>
            <span>${ELECTRICITY_PRICE_PER_KWH}/kWh (home)</span>
          </div>
          <div className="nl-assump-row">
            <span>Balloon / residual</span>
            <span>ATO minimum (28.13% on 5yr)</span>
          </div>
          <div className="nl-assump-row">
            <span>Tax rates</span>
            <span>FY2025–26</span>
          </div>
        </div>
      </details>
    </div>
  );
}
