import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { NavLinks } from "@/components/NavLinks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring focus:outline-none"
        >
          Skip to calculator
        </a>
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              NovaLease<span className="text-emerald-600">.</span>
            </Link>
            <NavLinks />
          </div>
        </header>
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="border-t mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-muted-foreground space-y-3">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/ev-novated-lease-australia" className="hover:text-foreground">EV Guide</Link>
              <Link href="/fbt-exemption-explained" className="hover:text-foreground">FBT Exemption</Link>
              <Link href="/novated-vs-cash-vs-loan" className="hover:text-foreground">vs Cash &amp; Loan</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/disclosure" className="hover:text-foreground">Disclosure</Link>
            </div>
            <p>NovaLease is an independent comparison tool. Not financial advice. FY2025-26 rates.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
