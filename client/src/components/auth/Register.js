import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../actions/authActions';
import './Auth.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const { name, email, password, confirmPassword, phone, acceptTerms } = formData;

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
            newErrors.phone = 'Please enter a valid Bangladeshi phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            newErrors.password = 'Password must contain uppercase, lowercase and number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep2()) {
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name: name.trim(),
                email: email.toLowerCase(),
                password,
                ...(phone && { phone })
            };

            await dispatch(register(userData));

            // Show success message
            setTimeout(() => {
                alert('🎉 Registration successful! Welcome to GoodDeal.');
                navigate('/');
            }, 1000);

        } catch (error) {
            console.error('Registration error:', error);

            if (error.message && error.message.includes('already exists')) {
                setErrors({ email: 'This email is already registered' });
                setCurrentStep(1);
            } else {
                setErrors({ general: error.message || 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const passwordStrength = () => {
        if (password.length === 0) return { strength: 0, text: '' };
        if (password.length < 6) return { strength: 1, text: 'Weak' };
        if (password.length < 8) return { strength: 2, text: 'Fair' };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: 'Good' };
        return { strength: 4, text: 'Strong' };
    };

    const strength = passwordStrength();

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
                            <h2>Join GoodDeal Today!</h2>
                            <p>Create your account and unlock amazing benefits:</p>
                            <div className="benefits-list">
                                <div className="benefit-item">
                                    <span className="benefit-icon">🎁</span>
                                    <div>
                                        <strong>Exclusive Deals</strong>
                                        <span>Special offers for members only</span>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">🚀</span>
                                    <div>
                                        <strong>Fast Checkout</strong>
                                        <span>Save your details for quicker purchases</span>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">📱</span>
                                    <div>
                                        <strong>Order Tracking</strong>
                                        <span>Real-time updates on your orders</span>
                                    </div>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">💝</span>
                                    <div>
                                        <strong>Wishlist</strong>
                                        <span>Save items for later</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-section">
                        <div className="form-header">
                            <h2>Create Account</h2>
                            <p>Join thousands of happy shoppers</p>

                            {/* Progress Steps */}
                            <div className="progress-steps">
                                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                    <span className="step-number">1</span>
                                    <span className="step-label">Personal Info</span>
                                </div>
                                <div className="step-connector"></div>
                                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                    <span className="step-number">2</span>
                                    <span className="step-label">Security</span>
                                </div>
                            </div>
                        </div>

                        {errors.general && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                {errors.general}
                            </div>
                        )}

                        <form onSubmit={onSubmit} className="auth-form">
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <div className="input-container">

                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={name}
                                                onChange={onChange}
                                                className={errors.name ? 'error' : ''}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <div className="input-container">

                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={email}
                                                onChange={onChange}
                                                className={errors.email ? 'error' : ''}
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number (Optional)</label>
                                        <div className="input-container">

                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={phone}
                                                onChange={onChange}
                                                className={errors.phone ? 'error' : ''}
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </div>
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-primary btn-large btn-full"
                                        onClick={nextStep}
                                    >
                                        Continue to Security
                                        <span className="arrow">→</span>
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Security */}
                            {currentStep === 2 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label htmlFor="password">Password *</label>
                                        <div className="input-container">

                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={password}
                                                onChange={onChange}
                                                className={errors.password ? 'error' : ''}
                                                placeholder="Create a strong password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? '🙈' : '👁️'}
                                            </button>
                                        </div>

                                        {/* Password Strength Meter */}
                                        {password && (
                                            <div className="password-strength">
                                                <div className="strength-meter">
                                                    <div
                                                        className={`strength-bar strength-${strength.strength}`}
                                                    ></div>
                                                </div>
                                                <span className="strength-text">{strength.text}</span>
                                            </div>
                                        )}

                                        {errors.password && <span className="error-text">{errors.password}</span>}

                                        <div className="password-requirements">
                                            <p>Password must contain:</p>
                                            <ul>
                                                <li className={password.length >= 6 ? 'met' : ''}>
                                                    At least 6 characters
                                                </li>
                                                <li className={/(?=.*[a-z])/.test(password) ? 'met' : ''}>
                                                    One lowercase letter
                                                </li>
                                                <li className={/(?=.*[A-Z])/.test(password) ? 'met' : ''}>
                                                    One uppercase letter
                                                </li>
                                                <li className={/(?=.*\d)/.test(password) ? 'met' : ''}>
                                                    One number
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm Password *</label>
                                        <div className="input-container">
                                            <span className="input-icon">🔒</span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={confirmPassword}
                                                onChange={onChange}
                                                className={errors.confirmPassword ? 'error' : ''}
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <span className="error-text">{errors.confirmPassword}</span>
                                        )}
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="acceptTerms"
                                                checked={acceptTerms}
                                                onChange={onChange}
                                            />
                                            <span className="checkmark"></span>
                                            I agree to the <Link to="/terms" className="link">Terms and Conditions</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>
                                        </label>
                                        {errors.acceptTerms && (
                                            <span className="error-text">{errors.acceptTerms}</span>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-large"
                                            onClick={prevStep}
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-large btn-full"
                                            disabled={loading || !acceptTerms}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="auth-footer">
                                <p>
                                    Already have an account?{' '}
                                    <Link to="/login" className="auth-link">
                                        Sign in here
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

export default Register;