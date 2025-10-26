// Updated Navbar.js with improved structure
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import './Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    GoodDeal
                </Link>

                <div className="navbar-links">
                    <Link to="/products">Products</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/cart">Cart</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin/products">Admin Products</Link>
                            )}
                            <span className="welcome-text">Welcome, {user?.name}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/register" className="register-btn">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;