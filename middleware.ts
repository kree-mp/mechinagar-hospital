import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  if (!token || !(await verifyToken(token))) {
    return NextResponse.redirect(new URL('/dev', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dev/dashboard/:path*', '/admin/:path*'],
};
