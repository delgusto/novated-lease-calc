import type { Metadata } from 'next';
import { ContentPage } from '@/components/ContentPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Page() {
  return (
    <ContentPage title="Privacy Policy">
      <p>
        NovaLease (&quot;we&quot;) is an independent comparison website. This policy explains what personal information we
        collect, how we use it, and your choices.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Details you submit through our quote form (name, email, phone, employer, notes)</li>
        <li>Anonymous analytics data about page visits (no cookies, no IP addresses stored)</li>
        <li>Server logs (IP, user agent) for security monitoring — retained for 30 days</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>Quote form submissions are shared with an independent novated lease specialist to contact you</li>
        <li>We do not sell your details to third parties</li>
        <li>We may email you a follow-up relating to your enquiry — you can opt out any time</li>
      </ul>

      <h2>Your rights under the Privacy Act 1988 (Cth)</h2>
      <ul>
        <li>You can request a copy of any personal information we hold about you</li>
        <li>You can ask us to correct or delete it</li>
        <li>You can complain to the Office of the Australian Information Commissioner if you&apos;re unhappy</li>
      </ul>

      <h2>Contact</h2>
      <p>
        For privacy requests, email <a href="mailto:privacy@novalease.com.au">privacy@novalease.com.au</a>.
      </p>

      <p className="text-sm text-muted-foreground pt-6">
        Last updated: April 2026.
      </p>
    </ContentPage>
  );
}
