import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'FBT EV Exemption Explained — How the Savings Work',
  description:
    'Plain-English explainer of the Australian FBT exemption for electric vehicles: the statutory method, ECM, the LCT threshold, and why exempt EVs come out 100% pre-tax.',
};

export default function Page() {
  return (
    <ContentPage
      title="The FBT EV exemption, explained simply"
      intro="This page explains why an eligible EV novated lease is so powerful: no FBT means no post-tax contribution means 100% pre-tax salary packaging."
    >
      <h2>Start with the default rule</h2>
      <p>
        When an employer provides an employee with a car (including via a novated lease), Fringe Benefits Tax is
        normally payable. Under the <strong>statutory formula method</strong>, the annual FBT taxable value is
        a flat <strong>20% of the car&apos;s GST-inclusive price</strong>.
      </p>
      <p>
        FBT is then charged at <strong>47%</strong> on the grossed-up taxable value (gross-up factor is 2.0802 for
        most novated leases where GST is claimable). That&apos;s a lot of tax.
      </p>

      <h2>How ECM usually cancels FBT</h2>
      <p>
        The Employee Contribution Method lets you make <strong>post-tax</strong> contributions equal to the
        statutory taxable value. That reduces the FBT taxable value to $0 — no FBT payable. But you still pay that
        ECM amount out of after-tax income.
      </p>
      <p>
        On a $45,000 ICE car, ECM is about $9,000/year post-tax. That&apos;s the trade-off: you swap FBT for
        post-tax cash out of your own pocket.
      </p>

      <h2>What the EV exemption actually does</h2>
      <p>
        For an eligible BEV under the LCT fuel-efficient threshold ($91,387 for FY2025-26):
      </p>
      <ul>
        <li>FBT taxable value is still calculated — but the tax is exempt under s8A FBTAA</li>
        <li>No FBT payable</li>
        <li><strong>No ECM needed</strong> — no post-tax contribution required</li>
        <li>
          The <strong>entire</strong> annual lease package (finance + running costs + fleet fee) comes out of
          pre-tax salary
        </li>
      </ul>
      <p>
        The savings compound with your marginal rate. Someone on a 37% marginal rate (+2% Medicare) effectively
        gets a 39% discount on everything inside the lease. On a 47% top-bracket earner, that&apos;s 49%.
      </p>

      <h2>Reportable fringe benefits</h2>
      <p>
        Even though FBT is $0, the grossed-up taxable value of the benefit still appears on your payment summary as
        a Reportable Fringe Benefits Amount (RFBA). This is for visibility, not taxation — but it <em>can</em>
        affect:
      </p>
      <ul>
        <li>Medicare levy surcharge (if your adjusted income crosses the threshold)</li>
        <li>HELP/HECS repayment income</li>
        <li>Family Tax Benefit and other income-tested benefits</li>
        <li>Child support assessments</li>
      </ul>
      <p>For most earners the impact is small, but worth checking if you&apos;re close to a threshold.</p>

      <h2>What we used in the calculator</h2>
      <ul>
        <li>FBT statutory rate: 20%</li>
        <li>FBT rate: 47%</li>
        <li>Type 1 gross-up: 2.0802</li>
        <li>LCT fuel-efficient threshold: $91,387 (FY2025-26)</li>
        <li>Residual values: ATO minimums (5yr = 28.13%)</li>
      </ul>
      <p>
        Numbers are estimates. Lease providers vary in finance rate (typically 7–10%) and admin fee (typically
        $500–$800/yr). Get a real quote before signing.
      </p>
    </ContentPage>
  );
}
