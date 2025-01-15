// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    // Optionally render a message or redirect (using next/navigation's redirect)
    return <div>No token found. Please log in.</div>;
  }

  try {
    // Verify token
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    // If valid, render the dashboard
    return <div>Welcome to your dashboard!</div>;
  } catch (error) {
    // If token is invalid, prompt for a re-login
    return <div>Invalid token. Please log in again.</div>;
  }
}
