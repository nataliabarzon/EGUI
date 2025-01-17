'use client';

import ProtectedRoute from '../protected-route';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="librarian">
      <div className="container">
        <h1>Admin Panel</h1>
        <p>Welcome! You have admin access.</p>
        {/* Admin functionalities go here */}
      </div>
    </ProtectedRoute>
  );
}
