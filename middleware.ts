import { NextRequest, NextResponse } from 'next/server';
import { isAllowed } from './src/lib/allowlist'; // you already have this

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // ✅ Let the quote-builder API run, even if /quote-builder is gated
  if (url.pathname.startsWith('/quote-builder/api')) {
    return NextResponse.next();
  }

  // (your existing protection below)
  if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/quote-builder')) {
    // this part is whatever you already have; example:
    const email = readSessionEmailEdge(req); // or getSessionEmail if you’re using the Node version in API routes only
    if (!email || !isAllowed(email.toLowerCase())) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('from', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Keep your existing config, but make sure /quote-builder is included if you want it gated:
export const config = { matcher: ['/dashboard/:path*', '/quote-builder/:path*'] };
import { NextRequest, NextResponse } from 'next/server';
import { isAllowed } from './src/lib/allowlist';

// Decode base64url safely on Edge (no Node Buffer)
function base64UrlToString(b64url: string) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '===='.slice(b64.length % 4) : '';
  return atob(b64 + pad);
}

function readSessionEmailEdge(req: NextRequest): string | null {
  const raw = req.cookies.get('session_v1')?.value;
  if (!raw) return null;

  // cookie format: "<base64url>.<hmacsig>"
  const [b64url] = raw.split('.');
  if (!b64url) return null;

  try {
    const jsonStr = base64UrlToString(b64url);
    const obj = JSON.parse(jsonStr);
    return typeof obj?.email === 'string' ? obj.email : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith('/dashboard')) {
    const email = readSessionEmailEdge(req);
    if (!email || !isAllowed(email.toLowerCase())) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('from', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
