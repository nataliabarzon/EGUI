
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;


const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/favicon.ico',
  '/public', 
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  
  const token = request.cookies.get('JWT')?.value;

  if (!token) {
    
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  try {
    
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    await jwtVerify(token, secret);

    
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);

    
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }
}


export const config = {
  matcher: [
    
    '/((?!auth/login|auth/register|favicon.ico|public).*)',
  ],
};
