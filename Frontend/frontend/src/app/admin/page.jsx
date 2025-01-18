'use client';

import ProtectedRoute from '../protected-route';
import { useAuth } from '../context/AuthContext';
import { Header } from '@/components/Header';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container">
        <Header />
        <h1>Admin Panel</h1>
        <p>Welcome! You have admin access.</p>
        {/* Admin functionalities go here */}
      </div>
    </ProtectedRoute>
  );
}
