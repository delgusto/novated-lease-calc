import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Novated Lease Calculator AU — EV FBT Exemption | NovaLease",
    template: "%s | NovaLease",
  },
  description:
    "Free Australian novated lease calculator. Compare EV FBT-exempt leases vs buying outright vs a car loan. FY2025-26 rates, no sign-up required.",
  metadataBase: new URL("https://novated-lease-calc.vercel.app"),
  openGraph: {
    title: "Novated Lease Calculator AU — EV FBT Exemption",
    description:
      "See exactly how much you save with an EV novated lease under the FBT exemption, vs buying outright or financing.",
    type: "website",
    locale: "en_AU",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring focus:outline-none"
        >
          Skip to calculator
        </a>

        <header className="nl-nav">
          <div className="nl-nav-inner">
            <Link href="/" className="nl-brand">
              <span className="nl-brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 13l3 3 7-7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="nl-brand-name">
                NovaLease<span className="nl-brand-dot">.</span>
              </span>
            </Link>
            <nav className="nl-nav-links">
              <Link href="/ev-novated-lease-australia">EV Guide</Link>
              <Link href="/fbt-exemption-explained">FBT Exemption</Link>
              <Link href="/novated-vs-cash-vs-loan">vs Cash &amp; Loan</Link>
              <Link href="#quote" className="nl-nav-cta">Get a quote</Link>
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        <footer className="nl-foot">
          <div className="nl-foot-inner">
            <div className="nl-foot-brand">
              <span className="nl-brand-name">
                NovaLease<span className="nl-brand-dot">.</span>
              </span>
              <p className="nl-foot-tag">
                Independent Australian novated lease comparison. Not financial advice. FY2025-26 rates.
              </p>
            </div>
            <div className="nl-foot-links">
              <Link href="/ev-novated-lease-australia">EV Guide</Link>
              <Link href="/fbt-exemption-explained">FBT Exemption</Link>
              <Link href="/novated-vs-cash-vs-loan">vs Cash &amp; Loan</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/disclosure">Disclosure</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
