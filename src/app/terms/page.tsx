import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function Page() {
  return (
    <ContentPage title="Terms of Use">
      <p>
        By using NovaLease, you agree to the following terms.
      </p>

      <h2>Not financial, tax, or legal advice</h2>
      <p>
        The calculator and content on this site is general information only. It does not take your personal
        circumstances into account. Before acting on anything here, get advice from a licensed financial adviser,
        registered tax agent, or your employer.
      </p>

      <h2>Estimates only</h2>
      <p>
        All numbers are estimates based on published AU tax brackets, FBT rules, and typical lease-provider
        defaults. Your actual outcome depends on your employer&apos;s payroll setup, the lease provider&apos;s
        rates and fees, and rules that may change without notice.
      </p>

      <h2>Affiliate and referral relationships</h2>
      <p>
        We may earn a referral fee if you submit a quote through our form. See our{' '}
        <a href="/disclosure">disclosure</a> for detail. Those fees do not change what you pay or the numbers we
        show you.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, NovaLease is not liable for any loss or damage arising from your
        use of, or reliance on, the information on this site.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of New South Wales, Australia.
      </p>

      <p className="text-sm text-muted-foreground pt-6">Last updated: April 2026.</p>
    </ContentPage>
  );
}
