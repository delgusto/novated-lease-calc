import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { FaqSection } from '@/components/FaqSection';
import { StructuredData } from '@/components/StructuredData';

export default function Home() {
  return (
    <>
      <StructuredData />
      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-emerald-50/40 to-transparent">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-10">
          <span className="inline-block text-xs font-medium tracking-wider uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
            FY2025-26 · EV FBT exemption included
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
            The honest Australian novated lease calculator.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            See exactly how much an electric novated lease saves you versus buying outright or financing — using the FBT exemption rules that actually apply right now. No sign-up, no sales calls, no gotchas.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Calculator />
      </section>

      {/* LEAD CAPTURE */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="rounded-xl border bg-card p-8">
          <h2 className="text-2xl font-semibold tracking-tight">Want an exact quote?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We&apos;ll have an independent novated lease specialist run your numbers on a real car, with your employer&apos;s actual FBT treatment. Free, no obligation.
          </p>
          <div className="mt-6">
            <LeadCaptureForm />
          </div>
        </div>
      </section>

      {/* TRUST / EXPLAINER */}
      <section className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold">Why novated leases work</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              The vehicle and its running costs come out of your pre-tax salary. For eligible EVs, the FBT
              exemption means zero post-tax contribution — 100% pre-tax.
            </p>
            <Link
              href="/fbt-exemption-explained"
              className="text-sm text-emerald-700 mt-3 inline-block hover:underline"
            >
              How the FBT exemption works →
            </Link>
          </div>
          <div>
            <h3 className="font-semibold">EV vs ICE vs PHEV</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Only battery EVs under the $91,387 fuel-efficient LCT threshold qualify in FY2025-26. The PHEV
              exemption ended 1 April 2025 for new leases.
            </p>
            <Link
              href="/ev-novated-lease-australia"
              className="text-sm text-emerald-700 mt-3 inline-block hover:underline"
            >
              Read the EV guide →
            </Link>
          </div>
          <div>
            <h3 className="font-semibold">Lease vs cash vs loan</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              A novated lease usually wins for EVs on salary over ~$90k. For cheap petrol cars, cash is often
              still the cheapest path.
            </p>
            <Link
              href="/novated-vs-cash-vs-loan"
              className="text-sm text-emerald-700 mt-3 inline-block hover:underline"
            >
              See the comparison →
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}
