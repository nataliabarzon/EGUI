
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in your environment.');
}

export async function middleware(request: NextRequest) {
  
  const publicPaths = ['/auth/login', '/auth/register', '/favicon.ico', '/public'];
  const { pathname } = request.nextUrl;

  
  if (publicPaths.some((path) => pathname.startsWith(path)) || /\.(.*)$/.test(pathname)) {
    return NextResponse.next();
  }

  
  const token = request.cookies.get('jwt')?.value;
  if (!token) {
    console.log('No JWT token found, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    return NextResponse.next();
  } catch (error) {
    console.error('Invalid JWT:', error);
    
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}


export const config = {
  matcher: [
    
    '/((?!auth/login|auth/register|favicon.ico|public).*)',
  ],
};
