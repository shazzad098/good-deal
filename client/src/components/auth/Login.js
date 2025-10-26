import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../actions/authActions';
import './Auth.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await dispatch(login(email, password));
            navigate('/');
        } catch (error) {
            setErrors({
                general: error.message || 'Invalid email or password. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleDemoLogin = (role) => {
        const demoCredentials = {
            admin: { email: 'admin@gooddeal.com', password: 'admin123' },
            user: { email: 'user@gooddeal.com', password: 'user123' }
        };

        setFormData(demoCredentials[role]);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Left Side - Branding */}
                    <div className="auth-branding">
                        <div className="brand-logo">
                            <div className="logo-icon">🛒</div>
                            <h1>GoodDeal</h1>
                        </div>
                        <div className="brand-content">
                            <h2>Welcome Back!</h2>
                            <p>Sign in to access your account and continue shopping with the best deals.</p>
                            <div className="features-list">
                                <div className="feature-item">
                                    <span className="feature-icon">🚚</span>
                                    <span>Free Shipping Over $50</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🔒</span>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">⭐</span>
                                    <span>Best Prices Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-section">
                        <div className="form-header">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>


                        {errors.general && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-container">

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        className={errors.email ? 'error' : ''}
                                        placeholder="Enter your email address"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-container">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        className={errors.password ? 'error' : ''}
                                        placeholder="Enter your password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                        disabled={loading}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-large btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            <div className="auth-footer">
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="auth-link">
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;