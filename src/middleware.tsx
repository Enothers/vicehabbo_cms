import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  // Simple check : redirection selon la présence du token
  if (url.pathname === '/me') {
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  if (url.pathname === '/login' || url.pathname === '/register') {
    if (token) {
      url.pathname = '/me';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/me', '/login', '/register'],
};
