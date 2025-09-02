// If you want to protect only /supplies (and anything under it)
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // or whatever cookie your backend sets
  if (!token) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', req.nextUrl.pathname); // optional "back to" after login
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// IMPORTANT: only run on /supplies
export const config = {
  matcher: ['/supplies/:path*'],
};
