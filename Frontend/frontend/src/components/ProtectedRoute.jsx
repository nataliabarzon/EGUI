'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {

        router.push('/auth/login');
      } else if (requiredRole && user.role !== requiredRole) {
        
        router.push('/unauthorized');
      }
    }
  }, [user, loading, router, requiredRole]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null; 
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; 
  }

  return <>{children}</>;
}
