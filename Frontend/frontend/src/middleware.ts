import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // const { pathname } = request.nextUrl;

  // // Allow public access to any route under /auth (e.g. /auth/login, /auth/register)
  // if (pathname.startsWith('/auth')) {
  //   return NextResponse.next();
  // }

  // // Try to retrieve the token from cookies (ensure that your login sets this cookie)
  // const token = request.cookies.get('token')?.value;

  // if (!token) {
  //   // No token found; redirect to the login page.
  //   const loginUrl = new URL('/auth/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // try {
  //   // Replace the secret with your actual JWT secret stored in an environment variable.
  //   const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
  //   await jwtVerify(token, secret);
  //   // Token is valid; allow the request.
  //   return NextResponse.next();
  // } catch (error) {
  //   console.error('Invalid token:', error);
  //   // Token is invalid, expired, or verification failed. Redirect to login.
  //   const loginUrl = new URL('/auth/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }
}

export const config = {
  matcher: '/((?!auth).*)', // Apply middleware to all paths except those starting with /auth
};
