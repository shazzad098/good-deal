// client/src/components/layout/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <Link to="/" className="navbar-brand" onClick={closeMenu}>
                        Good Deal
                    </Link>

                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                        <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="nav-link cart-link" onClick={closeMenu}>
                                    Cart
                                    <span className="cart-badge">0</span>
                                </Link>

                                {/* Admin Links - Only visible to Admin */}
                                {user?.role === 'admin' && (
                                    <div className="admin-links">
                                        <Link to="/admin/products" className="nav-link admin-link" onClick={closeMenu}>
                                            📦 Manage Products
                                        </Link>
                                        <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                            ⚙️ Dashboard
                                        </Link>
                                    </div>
                                )}

                                {/* User Menu */}
                                <div className="user-info">
                                    <span className="welcome-text">Welcome, {user?.name}</span>
                                    <button onClick={handleLogout} className="logout-btn">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Guest Links */
                            <div className="auth-links">
                                <Link to="/login" className="nav-link login-btn auth-btn" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="nav-link register-btn auth-btn" onClick={closeMenu}>
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Backdrop */}
            {isMenuOpen && (
                <div
                    className="mobile-backdrop active"
                    onClick={closeMenu}
                ></div>
            )}
        </>
    );
};

export default Navbar;