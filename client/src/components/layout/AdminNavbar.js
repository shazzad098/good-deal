// client/src/components/layout/AdminNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-container">
                <div className="admin-nav-brand">
                    <Link to="/admin">GoodDeal Admin</Link>
                </div>

                <div className="admin-nav-links">
                    <Link to="/admin/dashboard" className="admin-nav-link">
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className="admin-nav-link">
                        Products
                    </Link>
                    <Link to="/admin/orders" className="admin-nav-link">
                        Orders
                    </Link>
                    <Link to="/" className="admin-nav-link" target="_blank">
                        View Site
                    </Link>
                </div>

                <div className="admin-nav-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;