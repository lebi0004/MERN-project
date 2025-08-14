// frontend/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Cookie name matches what the backend sets
  const token = req.cookies.get('token')?.value;

  // If no token and trying to access a protected route, go to /login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    // Preserve where they were trying to go:
    loginUrl.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect everything except login/register and static assets
export const config = {
  matcher: [
    '/((?!login|register|_next/static|_next/image|favicon.ico).*)',
  ],
};
