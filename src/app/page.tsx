import { Calculator } from '@/components/Calculator';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { FaqSection } from '@/components/FaqSection';
import { StructuredData } from '@/components/StructuredData';
import { LCT_THRESHOLD_FUEL_EFFICIENT } from '@/lib/calc/constants';

export default function Home() {
  return (
    <>
      <StructuredData />

      {/* HERO + CALCULATOR */}
      <section className="nl-hero" id="calc">
        <div className="nl-hero-inner">
          <div className="nl-hero-meta">
            <span className="nl-chip">
              <span className="nl-chip-dot" aria-hidden="true" />
              FY2025–26 · EV FBT exemption live
            </span>
            <h1 className="nl-hero-h1">
              See what a novated lease
              <br />
              <em>actually</em> costs you.
            </h1>
            <p className="nl-hero-sub">
              An independent Australian calculator. Compare an EV novated lease against buying
              outright or taking a car loan — with the FBT exemption rules that apply right now. No
              sign-up. No sales funnel.
            </p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* EXPLAIN STRIP */}
      <section className="nl-explain" id="about">
        <div className="nl-explain-inner">
          <div className="nl-explain-item">
            <span className="nl-explain-num">01</span>
            <h3>Your car + its running costs come from pre-tax salary</h3>
            <p>
              Finance, fuel or electricity, rego, insurance, servicing, tyres — bundled into a
              single package deducted before income tax.
            </p>
          </div>
          <div className="nl-explain-item">
            <span className="nl-explain-num">02</span>
            <h3>Eligible EVs skip FBT entirely</h3>
            <p>
              Battery EVs under the ${LCT_THRESHOLD_FUEL_EFFICIENT.toLocaleString('en-AU')}{' '}
              fuel-efficient LCT threshold pay zero FBT. That&apos;s 100% pre-tax, no employee
              contribution.
            </p>
          </div>
          <div className="nl-explain-item">
            <span className="nl-explain-num">03</span>
            <h3>You don&apos;t own it until you pay the residual</h3>
            <p>
              At term end: pay the ATO-prescribed balloon to keep it, refinance into a new lease, or
              hand it back. The numbers here net that out.
            </p>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE */}
      <section className="nl-quote" id="quote">
        <div className="nl-quote-inner">
          <div className="nl-quote-copy">
            <span className="nl-eyebrow">Ready for real numbers?</span>
            <h2>Want an exact quote on a real car?</h2>
            <p>
              We&apos;ll have an independent specialist run your figures on an actual car with your
              employer&apos;s FBT treatment. Free. No obligation. No call-centre chasing.
            </p>
          </div>
          <LeadCaptureForm />
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />
    </>
  );
}
