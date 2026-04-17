import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight text-lg">
              NovaLease<span className="text-emerald-600">.</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/ev-novated-lease-australia" className="hover:text-foreground">
                EV Guide
              </Link>
              <Link href="/fbt-exemption-explained" className="hover:text-foreground">
                FBT Exemption
              </Link>
              <Link href="/novated-vs-cash-vs-loan" className="hover:text-foreground">
                vs Cash & Loan
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <p>
              NovaLease is an independent comparison tool. Not financial advice. FY2025-26 rates.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/disclosure" className="hover:text-foreground">Disclosure</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
