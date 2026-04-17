import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = {
  title: 'Novated Lease vs Cash vs Car Loan — Which Is Cheapest?',
  description:
    'Honest side-by-side of an Australian novated lease, paying cash, and taking out a car loan. When each one wins, and the catches nobody tells you.',
};

export default function Page() {
  return (
    <ContentPage
      title="Novated Lease vs Cash vs Car Loan"
      intro="Three ways to get into a car in Australia. Here's when each one actually wins, with the honest trade-offs."
    >
      <h2>Headline answer</h2>
      <ul>
        <li><strong>Eligible EV, salary over $90k:</strong> novated lease with FBT exemption, every time</li>
        <li><strong>ICE car, salary $90k+, high kms:</strong> novated lease with ECM usually wins</li>
        <li><strong>Cheap used car, modest salary:</strong> cash if you have it</li>
        <li><strong>Don&apos;t have cash, not eligible for novated:</strong> a car loan — shop the rate hard</li>
      </ul>

      <h2>Novated lease — pros and cons</h2>
      <h3>Pros</h3>
      <ul>
        <li>Pre-tax salary packaging — immediate savings at your marginal rate</li>
        <li>All-in-one: finance + rego + insurance + servicing + fuel/electricity bundled</li>
        <li>GST savings on car purchase price and running costs (employer claims input credit)</li>
        <li>EV FBT exemption: 100% pre-tax (see the <a href="/fbt-exemption-explained">FBT guide</a>)</li>
      </ul>
      <h3>Cons</h3>
      <ul>
        <li>You don&apos;t own the car at end of term — there&apos;s a balloon/residual to pay</li>
        <li>Effective interest rates are often 7–11%, sometimes hidden</li>
        <li>Locks you into your employer — change jobs mid-lease and you need to port or refinance</li>
        <li>Admin fees ($500–$800/yr) can eat into savings on cheaper cars</li>
      </ul>

      <h2>Cash — pros and cons</h2>
      <h3>Pros</h3>
      <ul>
        <li>No interest, no admin fees, no lease-end balloon</li>
        <li>You own the car outright from day one</li>
        <li>Total flexibility — sell, trade, keep, whatever</li>
      </ul>
      <h3>Cons</h3>
      <ul>
        <li>Huge cash flow hit — $60k out of your savings is real money</li>
        <li>Opportunity cost: that $60k invested would return something over the lease term</li>
        <li>All running costs are post-tax</li>
        <li>No FBT exemption benefit — you miss out on the big EV tax saving</li>
      </ul>

      <h2>Car loan — pros and cons</h2>
      <h3>Pros</h3>
      <ul>
        <li>You own the car at end of term</li>
        <li>No employer involvement — works for self-employed, contractors, anyone</li>
        <li>Fixed repayments, transparent interest rate</li>
      </ul>
      <h3>Cons</h3>
      <ul>
        <li>All repayments + running costs are post-tax</li>
        <li>Secured car loans typically 6.5–9%, unsecured 9–14%</li>
        <li>No tax advantage at all</li>
      </ul>

      <h2>What the calculator assumes</h2>
      <p>To keep the comparison honest we used these defaults:</p>
      <ul>
        <li>Novated lease finance rate: 8.5% p.a.</li>
        <li>Car loan rate: 8.9% p.a.</li>
        <li>Fleet management fee: $660/yr</li>
        <li>Cash scenario ignores opportunity cost on the lump sum (we don&apos;t credit you for market returns)</li>
        <li>Resale value at end = ATO-prescribed residual (conservative; real EV resale is often higher)</li>
        <li>Running costs are AU averages — your insurance and servicing may differ</li>
      </ul>

      <h2>When the calculator says cash wins</h2>
      <p>
        Usually on a cheap, reliable ICE car (e.g. a $25k Toyota) and a middling salary. The FBT overhead on a
        cheap car kills the novated maths. The novated lease needs either (a) the FBT exemption or (b) a high
        marginal tax rate and a sizeable car to pull ahead.
      </p>
    </ContentPage>
  );
}
