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
    const { itemCount } = useSelector(state => state.cart); // <-- === কার্ট কাউন্ট যোগ করা হয়েছে ===
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
            <div className="nav-backdrop"></div>
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

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link" onClick={closeMenu}>
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </Link>

                    {!isAdmin && (
                        <Link to="/products" className="nav-link" onClick={closeMenu}>
                            <span className="nav-icon">📦</span>
                            <span className="nav-text">Products</span>
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                    <span className="nav-icon">🛠️</span>
                                    <span className="nav-text">Admin Dashboard</span>
                                </Link>
                            )}
                            {/* === পরিবর্তন: কার্ট লিংক ও ব্যাজ === */}
                            <Link to="/cart" className="nav-link nav-cart-link" onClick={closeMenu}>
                                <span className="nav-icon">🛒</span>
                                <span className="nav-text">Cart</span>
                                {itemCount > 0 && (
                                    <span className="cart-badge">{itemCount}</span>
                                )}
                            </Link>
                            {/* ================================== */}
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
                            {/* === পরিবর্তন: কার্ট লিংক ও ব্যাজ (লগআউট অবস্থা) === */}
                            <Link to="/cart" className="nav-link nav-cart-link" onClick={closeMenu}>
                                <span className="nav-icon">🛒</span>
                                <span className="nav-text">Cart</span>
                                {itemCount > 0 && (
                                    <span className="cart-badge">{itemCount}</span>
                                )}
                            </Link>
                            {/* ================================== */}
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
            </div>

            <Alert />

            {isMenuOpen && (
                <div className="nav-overlay" onClick={closeMenu}></div>
            )}
        </nav>
    );
};

export default Navbar;
