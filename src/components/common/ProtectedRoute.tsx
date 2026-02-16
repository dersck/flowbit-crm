import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

interface ProtectedRouteProps {
    requireWorkspace?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireWorkspace = true }) => {
    const { user, appUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (requireWorkspace && !appUser?.defaultWorkspaceId) {
        // If user is authenticated but has no workspace, redirect to onboarding
        if (location.pathname !== '/onboarding') {
            return <Navigate to="/onboarding" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
