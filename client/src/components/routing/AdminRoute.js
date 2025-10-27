// client/src/components/routing/AdminRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If user is not admin
    if (user && user.role !== 'admin') {
        return (
            <div className="container">
                <div className="access-denied">
                    <h2>🚫 Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                    <button onClick={() => window.history.back()} className="btn btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // If everything is fine, render the children
    return children;
};

export default AdminRoute;