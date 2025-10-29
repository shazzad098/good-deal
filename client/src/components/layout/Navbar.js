// client/src/components/layout/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="nav-backdrop"></div>
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" onClick={closeMenu}>
                        <span className="brand-icon">🛍️</span>
                        <span className="brand-text">GoodDeal</span>
                    </Link>
                </div>

                {/* Hamburger Menu Button */}
                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMenu}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </Link>
                    <Link to="/products" className="nav-link" onClick={closeMenu}>
                        <span className="nav-icon">📦</span>
                        <span className="nav-text">Products</span>
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user && user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                    <span className="nav-icon">🛠️</span>
                                    <span className="nav-text">Admin Dashboard</span>
                                </Link>
                            )}
                            <Link to="/cart" className="nav-link" onClick={closeMenu}>
                                <span className="nav-icon">🛒</span>
                                <span className="nav-text">Cart</span>
                            </Link>
                            <div className="user-section">
                                <div className="user-avatar">👤</div>
                                <div className="user-info">
                                    <div className="user-greeting">Hello,</div>
                                    <div className="user-name">{user?.name}</div>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                <span className="logout-icon">🚪</span>
                                <span className="logout-text">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
                                <span className="nav-icon">🔐</span>
                                <span className="nav-text">Login</span>
                            </Link>
                            <Link to="/register" className="nav-link register-link" onClick={closeMenu}>
                                <span className="nav-icon">📝</span>
                                <span className="nav-text">Register</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Overlay for mobile */}
                {isMenuOpen && (
                    <div className="nav-overlay" onClick={closeMenu}></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;