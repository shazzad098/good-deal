import axios from 'axios';
import { loginSuccess, loginFail, logout, userLoaded } from '../reducers/authReducer';

// Register User
export const register = (formData) => async (dispatch) => {
    try {
        const res = await axios.post('/api/auth/register', formData);

        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }

        dispatch(loginSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(loginFail());

        // Throw the error message for the component to handle
        const errorMessage = error.response?.data?.message || 'Registration failed';
        throw new Error(errorMessage);
    }
};

// Login User
export const login = (email, password) => async (dispatch) => {
    try {
        const res = await axios.post('/api/auth/login', { email, password });

        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }

        dispatch(loginSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(loginFail());

        const errorMessage = error.response?.data?.message || 'Login failed';
        throw new Error(errorMessage);
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const res = await axios.get('/api/auth/me');
            dispatch(userLoaded(res.data));
        }
    } catch (error) {
        dispatch(loginFail());
    }
};

// Logout
export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch(logout());
};