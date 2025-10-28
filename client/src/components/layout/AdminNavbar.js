// client/src/components/layout/AdminNavbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-container">
                {/* Brand */}
                <div className="admin-nav-brand">
                    <Link to="/admin">GoodDeal Admin</Link>
                </div>

                {/* Hamburger Button (Mobile Only) */}
                <button
                    className="admin-hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`admin-nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link
                        to="/admin/dashboard"
                        className="admin-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className="admin-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="admin-nav-link"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Orders
                    </Link>
                    <Link
                        to="/"
                        className="admin-nav-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        View Site
                    </Link>
                </div>

                {/* User Section (Hidden on Mobile) */}
                <div className="admin-nav-user desktop-only">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile User Section (Visible only on small screens) */}
            {isMenuOpen && (
                <div className="admin-mobile-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="admin-logout-btn mobile">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;