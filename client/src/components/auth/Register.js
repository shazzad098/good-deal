// client/src/components/auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setAlert } from '../../actions/authActions';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    // const alert = useSelector(state => state.alert); // <-- REMOVED

    const { name, email, password, password2 } = formData;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== password2) {
            dispatch(setAlert('Passwords do not match', 'error'));
            return;
        }

        if (password.length < 6) {
            dispatch(setAlert('Password must be at least 6 characters', 'error'));
            return;
        }

        dispatch(registerUser({ name, email, password }));
    };

    return (
        <div className="register-page">
            <div className="container">
                <div className="register-form-container">
                    <h2>Create Your Account</h2>

                    {/* Local alert rendering block remove kora holo */}
                    {/*
                    {alert && alert.map(alert => (
                        <div key={alert.id} className={`alert alert-${alert.type}`}>
                            {alert.msg}
                        </div>
                    ))}
                    */}

                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                minLength="6"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                name="password2"
                                value={password2}
                                onChange={onChange}
                                minLength="6"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <div className="login-link">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;