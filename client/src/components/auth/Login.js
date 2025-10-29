// client/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setAlert } from '../../actions/authActions';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Alert state select kora bondho kora hocche
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    // const alert = useSelector(state => state.alert); // <-- REMOVED

    const { email, password } = formData;

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

        if (!email || !password) {
            dispatch(setAlert('Please fill in all fields', 'error'));
            return;
        }

        dispatch(loginUser(email, password));
    };

    return (
        <div className="login-page">
            <div className="container">
                <div className="login-form-container">
                    <h2>Sign In to GoodDeal</h2>

                    {/* Local alert rendering block remove kora holo */}
                    {/* {alert && alert.map(alert => (
                        <div key={alert.id} className={`alert alert-${alert.type}`}>
                            {alert.msg}
                        </div>
                    ))}
                    */}

                    <form onSubmit={onSubmit}>
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

                        <div className="remember-forgot">
                            <label className="remember-me">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'SIGN IN'}
                        </button>
                    </form>

                    <div className="register-link">
                        Don't have an account? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;