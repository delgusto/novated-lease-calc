'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function LeadCaptureForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-lg border border-emerald-600 bg-emerald-50 p-6">
        <h3 className="font-semibold text-emerald-900">Thanks — we&apos;ll be in touch.</h3>
        <p className="text-sm text-emerald-900/80 mt-1">
          An independent novated lease specialist will reach out in the next business day with a personalised quote.
          No obligation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-busy={status === 'submitting'}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employer">Employer (optional)</Label>
          <Input id="employer" name="employer" placeholder="For FBT eligibility check" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Anything specific?</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="e.g. specific car, trade-in, budget constraints..."
        />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        We&apos;ll only use your details to get you a quote. No spam. See our{' '}
        <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>.
      </p>
      <Button type="submit" disabled={status === 'submitting'} size="lg" className="w-full sm:w-auto">
        {status === 'submitting' ? 'Sending…' : 'Get my personalised quote'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
