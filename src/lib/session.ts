import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
const COOKIE = 'session_v1';
const secret = process.env.SESSION_SECRET || 'dev-secret';
function sign(value: string) { const h = crypto.createHmac('sha256', secret); h.update(value); return h.digest('hex'); }
export function setSessionCookie(res: NextResponse, email: string) {
  const payload = JSON.stringify({ email, ts: Date.now() });
  const b64 = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = sign(b64);
  res.cookies.set(COOKIE, `${b64}.${sig}`, { httpOnly:true, sameSite:'lax', secure: process.env.NODE_ENV==='production', path:'/', maxAge: 60*60*24*1 });
}
export function getSessionEmail(req: NextRequest): string | null {
  const raw = req.cookies.get(COOKIE)?.value; if (!raw) return null;
  const [b64, sig] = raw.split('.'); if (!b64 || !sig) return null;
  if (sign(b64) !== sig) return null;
  try { const json = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8')); return typeof json?.email==='string' ? json.email : null; } catch { return null; }
}
