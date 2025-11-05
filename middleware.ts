import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from './src/lib/session';
import { isAllowed } from './src/lib/allowlist';
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  if (url.pathname.startsWith('/dashboard')) {
    const email = getSessionEmail(req);
    if (!email || !isAllowed(email.toLowerCase())) {
      const loginUrl = new URL('/', req.url);
      loginUrl.searchParams.set('from', url.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
