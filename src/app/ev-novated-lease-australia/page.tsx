import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'EV Novated Lease Australia — Complete 2026 Guide',
  description:
    "Everything Australians need to know about EV novated leases in FY2025-26: the FBT exemption, LCT threshold, post-PHEV rules, and how much you'll actually save.",
};

export default function Page() {
  return (
    <ContentPage
      title="EV Novated Lease Australia — the 2026 guide"
      intro="If you earn over ~$90,000 and your employer offers salary packaging, an EV novated lease is one of the biggest tax savings currently available to PAYG employees in Australia. Here's how it actually works."
    >
      <h2>The short version</h2>
      <p>
        Under the Fringe Benefits Tax Assessment Act, battery electric vehicles (BEVs) and hydrogen fuel-cell vehicles
        purchased via a novated lease are <strong>exempt from FBT</strong> when their first retail price is at or below
        the Luxury Car Tax (LCT) threshold for fuel-efficient vehicles —{' '}
        <strong>$91,387 for FY2025-26</strong>.
      </p>
      <p>
        That means 100% of the lease payment — finance, rego, insurance, servicing, tyres, and home-charging
        electricity — comes out of your <strong>pre-tax</strong> salary. No Employee Contribution Method (ECM)
        required. Your marginal tax rate (often 37% or 47%) effectively subsidises most of the car.
      </p>

      <h2>Who qualifies</h2>
      <ul>
        <li>You&apos;re a PAYG employee and your employer offers novated leasing (most large AU employers do)</li>
        <li>The vehicle is a new or demo BEV or hydrogen FCEV</li>
        <li>First retail price ≤ $91,387 (GST incl, luxury car tax threshold for fuel-efficient cars FY2025-26)</li>
        <li>The vehicle is first held and used after 1 July 2022</li>
      </ul>

      <h2>What changed on 1 April 2025</h2>
      <p>
        The FBT exemption for plug-in hybrid electric vehicles (PHEVs) ended for <strong>new leases</strong> from 1
        April 2025. Existing PHEV leases that were in place before that date are grandfathered and remain exempt
        until the lease ends. For any new lease being set up now, only BEVs and hydrogen FCEVs qualify.
      </p>

      <h2>How much do you actually save?</h2>
      <p>
        On a $60,000 BEV, a 5-year lease, and a $120,000 salary, the FBT exemption typically saves you{' '}
        <strong>$20,000–$30,000</strong> over the term versus paying cash or taking a conventional car loan. Exact
        numbers depend on your marginal tax rate, kms driven, and the lease provider&apos;s finance rate.
      </p>
      <p>
        Use the <a href="/">calculator on the homepage</a> to see your specific numbers.
      </p>

      <h2>The catches nobody tells you</h2>
      <h3>1. The residual</h3>
      <p>
        At the end of the lease you own nothing — you either pay the ATO-prescribed residual to keep the car
        (typically 28% of ex-GST price on a 5-year lease), re-finance, or hand it back. Budget for it.
      </p>
      <h3>2. Lease provider finance rates</h3>
      <p>
        Providers don&apos;t always show their interest rate. Effective rates of 8–11% are common — ask explicitly
        and compare two or three providers before signing.
      </p>
      <h3>3. Employer payroll treatment</h3>
      <p>
        Your employer is on the hook for correct FBT reporting. Some HR teams are still skittish about the exemption.
        Ask your employer in writing that they&apos;ll treat the lease as FBT-exempt before you sign.
      </p>
      <h3>4. Reportable fringe benefits (RFBA)</h3>
      <p>
        Even though FBT is $0 on an exempt EV, the grossed-up taxable value still shows on your payment summary and
        can affect Medicare surcharge, HELP repayments, and some government benefits. Worth a chat with an
        accountant if you&apos;re near a threshold.
      </p>

      <h2>Is a novated lease worth it for you?</h2>
      <p>Rules of thumb:</p>
      <ul>
        <li><strong>Income under $45,000</strong>: probably not — your marginal rate is too low</li>
        <li><strong>$45,000–$90,000 on an ICE car</strong>: marginal. Often a car loan or cash is cheaper</li>
        <li><strong>$90,000+ on an FBT-exempt EV</strong>: almost always wins</li>
        <li><strong>$180,000+ on an FBT-exempt EV</strong>: it&apos;s obscene how much you save</li>
      </ul>
      <p>
        This isn&apos;t financial advice. See our <a href="/disclosure">disclosure</a>.
      </p>
    </ContentPage>
  );
}
