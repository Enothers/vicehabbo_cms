import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  const { pathname } = url;
  const protectedRoutes = ['/me', '/shop', '/forum'];
  const authPages = ['/login', '/register'];

  if (protectedRoutes.includes(pathname) && !token) {
    url.pathname = '/login';
    return (NextResponse.redirect(url));
  }

  if (authPages.includes(pathname) && token) {
    url.pathname = '/me';
    return (NextResponse.redirect(url));
  }

  return (NextResponse.next());
}

export const config = {
  matcher: ['/me', '/login', '/register', '/shop', '/forum'],
};
