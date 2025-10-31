// client/src/components/layout/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import Alert from './Alert'; 
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { itemCount } = useSelector(state => state.cart);
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

    const isAdmin = isAuthenticated && user && user.role === 'admin';

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/" onClick={closeMenu}>
                        <span className="brand-icon">🛍️</span>
                        <span className="brand-text">GoodDeal</span>
                    </Link>
                </div>

                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* === PORIBORTON: Link-guloke main-links ebong auth-links-e vag kora === */}
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <div className="nav-main-links">
                        <Link to="/" className="nav-link" onClick={closeMenu}>
                            Home
                        </Link>

                        {!isAdmin && (
                            <Link to="/products" className="nav-link" onClick={closeMenu}>
                                Products
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                Admin Dashboard
                            </Link>
                        )}
                        
                        {/* Shobar jonno Cart Link */}
                        <Link to="/cart" className="nav-link nav-cart-link" onClick={closeMenu}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <span>Cart</span>
                            {itemCount > 0 && (
                                <span className="cart-badge">{itemCount}</span>
                            )}
                        </Link>
                    </div>

                    <div className="nav-auth-actions">
                        {isAuthenticated ? (
                            <>
                                <div className="user-section">
                                    <span className="user-avatar">👤</span>
                                    <span className="user-name">{user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className="btn-logout">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                {/* =================================================================== */}

            </div>

            <Alert />

            {isMenuOpen && (
                <div className="nav-overlay" onClick={closeMenu}></div>
            )}
        </nav>
    );
};

export default Navbar;