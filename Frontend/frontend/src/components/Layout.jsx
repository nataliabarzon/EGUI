'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null);
        router.push('/auth/login');
      } else {
        console.error('Logout failed.');
      }
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  return (
    <div>
      <nav>
        {/* Add navigation links here */}
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/auth/login">Login</a>
            <a href="/auth/register">Register</a>
          </>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}
