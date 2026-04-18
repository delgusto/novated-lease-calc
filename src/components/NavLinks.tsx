'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/ev-novated-lease-australia', label: 'EV Guide' },
  { href: '/fbt-exemption-explained', label: 'FBT Exemption' },
  { href: '/novated-vs-cash-vs-loan', label: 'vs Cash & Loan' },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className="hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:font-medium"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
