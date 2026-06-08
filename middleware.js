import { NextResponse } from 'next/server';

function routeForRole(role) {
  return role === 'waiter' ? '/waiter' : '/manager';
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('orderix_role')?.value || null;

  if (pathname === '/login' && role) {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  if (pathname === '/manager' && role === 'waiter') {
    return NextResponse.redirect(new URL('/waiter', request.url));
  }

  if (pathname === '/waiter' && role && role !== 'waiter') {
    return NextResponse.redirect(new URL(routeForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/manager', '/waiter'],
};
