import { NextRequest, NextResponse } from 'next/server';
import { isAllowed } from '../../../src/lib/allowlist';
import { setSessionCookie } from '../../../src/lib/session';
import { z } from 'zod';

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (!isAllowed(email)) return NextResponse.json({ error: 'This email is not allowlisted.' }, { status: 403 });
  const res = NextResponse.json({ ok: true }, { status: 200 });
  setSessionCookie(res, email);
  return res;
}
