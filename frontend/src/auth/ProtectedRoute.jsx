import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    // Agar user login nahi hai, toh wapas login page par bhej do
    if (!user && !localToken) {
        return <Navigate to="/admin/login" replace />;
    }

    // Agar login hai, toh Admin Dashboard dikha do
    return children;
};

export default ProtectedRoute;
