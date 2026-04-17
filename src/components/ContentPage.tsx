import Link from 'next/link';
import { ReactNode } from 'react';

export function ContentPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        ← Back to calculator
      </Link>
      <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
      {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
      <div
        className="mt-8 space-y-5 leading-relaxed
                   [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3
                   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                   [&_p]:text-[15.5px]
                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
                   [&_a]:text-emerald-700 [&_a]:underline-offset-2 hover:[&_a]:underline
                   [&_strong]:font-semibold
                   [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground"
      >
        {children}
      </div>
    </article>
  );
}
