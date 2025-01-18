import React from 'react';
import {Header} from '@/components/Header';
import {BooksManagement} from '@/components/BooksManagement';
import ProtectedRoute from '@/app/protected-route';

const AdminBooksPage = () => {
    return (
        <ProtectedRoute>
            <Header />
            <BooksManagement />
        </ProtectedRoute>
    );
};

export default AdminBooksPage;