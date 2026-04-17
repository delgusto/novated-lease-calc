import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const LEADS_FILE = path.join(process.cwd(), 'leads.jsonl');

type LeadPayload = Record<string, unknown>;

function isValid(data: LeadPayload): data is { name: string; email: string } {
  return (
    typeof data.name === 'string' &&
    data.name.trim().length > 0 &&
    typeof data.email === 'string' &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)
  );
}

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = await req.json();
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }
  if (!isValid(body)) {
    return new NextResponse('Missing or invalid name/email', { status: 400 });
  }

  const record = {
    ...body,
    submittedAt: new Date().toISOString(),
    userAgent: req.headers.get('user-agent') ?? null,
  };

  // Dev / preview: append to leads.jsonl.
  // Prod on Vercel: stdout — captured in Vercel logs. Swap to a DB or email in a follow-up.
  try {
    if (process.env.VERCEL) {
      console.log(JSON.stringify({ lead: record }));
    } else {
      await fs.appendFile(LEADS_FILE, JSON.stringify(record) + '\n', 'utf8');
    }
  } catch (err) {
    console.error('Failed to persist lead', err);
    return new NextResponse('Could not save', { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
