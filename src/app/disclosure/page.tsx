import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Disclosure' };

export default function Page() {
  return (
    <ContentPage title="Affiliate &amp; advice disclosure">
      <h2>We&apos;re not licensed advisers</h2>
      <p>
        NovaLease is a comparison tool, not a financial services or credit licence holder. Nothing on this site is
        personal advice. We recommend you speak with a licensed financial adviser, registered tax agent, and/or
        your employer&apos;s payroll team before entering any novated lease.
      </p>

      <h2>How we make money</h2>
      <p>
        We operate on a referral model. When you submit the &quot;Get my personalised quote&quot; form, your details
        may be shared with an independent novated lease specialist or a comparison platform, who may pay us a
        referral fee if you end up signing a lease through them.
      </p>
      <p>
        This fee does not increase what you pay. The numbers shown in our calculator are generated from published
        tax rules and default assumptions — they are not influenced by who pays us.
      </p>

      <h2>No exclusive deals</h2>
      <p>
        We are not owned by or contracted exclusively to any single lease provider. If we added sponsored
        placements in future, they will be clearly labelled as such.
      </p>

      <h2>How to get independent advice</h2>
      <ul>
        <li>
          <a href="https://moneysmart.gov.au/financial-advice">Moneysmart — Financial advice</a>
        </li>
        <li>
          <a href="https://www.tpb.gov.au/public-register">TPB Public Register of tax agents</a>
        </li>
      </ul>

      <p className="text-sm text-muted-foreground pt-6">Last updated: April 2026.</p>
    </ContentPage>
  );
}
