import ProtectedRoute from '@/app/protected-route';
import { Header } from '@/components/Header';
import { UserManagement } from '@/components/UserManagement';
import React from 'react';

const UsersPage = () => {
    return (
            <ProtectedRoute>
            <Header />
            <UserManagement />
                </ProtectedRoute>
    );
};

export default UsersPage;