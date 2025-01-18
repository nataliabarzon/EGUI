import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { email, name, surname, password } = await request.json();

    const response = await fetch('https://egui.onrender.com/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, surname, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

      const jwt = await new SignJWT({ id: data.id, email: data.email, role: data.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);

      return NextResponse.json({ token: jwt, user: data });
    } else {
      return NextResponse.json(
        { message: data.message || 'Registration failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}
