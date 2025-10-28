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
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" onClick={closeMenu}>🛍️ GoodDeal</Link>
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
                        🏠 Home
                    </Link>
                    <Link to="/products" className="nav-link" onClick={closeMenu}>
                        📦 Products
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user && user.role === 'admin' && (
                                <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                    🛠️ Admin Dashboard
                                </Link>
                            )}
                            <Link to="/cart" className="nav-link" onClick={closeMenu}>
                                🛒 Cart
                            </Link>
                            <div className="user-greeting">
                                👋 Hello, {user?.name}
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" onClick={closeMenu}>
                                🔐 Login
                            </Link>
                            <Link to="/register" className="nav-link" onClick={closeMenu}>
                                📝 Register
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