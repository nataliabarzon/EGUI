'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const data = JSON.parse(user);

    if (!user) {
      router.push('/auth/login');
    }
    if (data && data.user?.role !== 'librarian' && window.location.pathname.includes('admin')) {
      router.push('/');
    }

  }, [router]);

  
  return <>{children}</>;
};


export default ProtectedRoute;
