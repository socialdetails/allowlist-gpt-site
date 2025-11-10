import { NextRequest, NextResponse } from 'next/server';
import { isAllowed } from './src/lib/allowlist';

// edge-safe cookie reader (no Node crypto)
function base64UrlToString(b64url: string) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (b64.length % 4)) % 4;
  const padded = b64 + '='.repeat(pad);
  return atob(padded);
}

function readSessionEmailEdge(req: NextRequest): string | null {
  const raw = req.cookies.get('session_v1')?.value;
  if (!raw) return null;
  const [b64url] = raw.split('.');
  if (!b64url) return null;
  try {
    const obj = JSON.parse(base64UrlToString(b64url));
    return typeof obj?.email === 'string' ? obj.email : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // allow the quote-builder API to run
  if (url.pathname.startsWith('/quote-builder/api')) {
    return NextResponse.next();
  }

  // protect dashboard + quote-builder pages
  const needsAuth =
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/quote-builder');

  if (needsAuth) {
    const email = readSessionEmailEdge(req);
    if (!email || !isAllowed(email.toLowerCase())) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('from', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/quote-builder/:path*']
};
