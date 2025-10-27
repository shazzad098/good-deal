// client/src/actions/authActions.js
import axios from 'axios';

// Set API base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Set Alert
export const setAlert = (msg, type) => ({
    type: 'SET_ALERT',
    payload: { msg, type, id: Date.now() }
});

// Remove Alert
export const removeAlert = (id) => ({
    type: 'REMOVE_ALERT',
    payload: id
});

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: 'AUTH_LOADING' });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/auth/register', userData, config);

        dispatch({
            type: 'REGISTER_SUCCESS',
            payload: res.data
        });

        dispatch(setAlert('Registration successful!', 'success'));

        // Auto remove alert after 3 seconds
        setTimeout(() => {
            dispatch(removeAlert(Date.now()));
        }, 3000);

    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';

        dispatch({
            type: 'AUTH_ERROR',
            payload: message
        });

        dispatch(setAlert(message, 'error'));

        setTimeout(() => {
            dispatch(removeAlert(Date.now()));
        }, 3000);
    }
};

// Login User
// Login User
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: 'AUTH_LOADING' });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/auth/login', { email, password }, config);

        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: res.data
        });

        dispatch(setAlert('Login successful!', 'success'));

        setTimeout(() => {
            dispatch(removeAlert(Date.now()));
        }, 3000);

    } catch (error) {
        console.error('Login error:', error);

        // Better error handling
        let message = 'Login failed';

        if (error.response) {
            // Server responded with error status
            message = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            // Request made but no response received
            message = 'No response from server. Please check if backend is running.';
        } else {
            // Something else happened
            message = error.message;
        }

        dispatch({
            type: 'AUTH_ERROR',
            payload: message
        });

        dispatch(setAlert(message, 'error'));

        setTimeout(() => {
            dispatch(removeAlert(Date.now()));
        }, 3000);
    }
};

// Logout User
export const logoutUser = () => (dispatch) => {
    dispatch({ type: 'LOGOUT' });
    dispatch(setAlert('Logged out successfully', 'success'));
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch({ type: 'AUTH_ERROR' });
            return;
        }

        const config = {
            headers: {
                'x-auth-token': token
            }
        };

        const res = await axios.get('/api/auth/user', config);

        dispatch({
            type: 'USER_LOADED',
            payload: res.data
        });
    } catch (error) {
        dispatch({ type: 'AUTH_ERROR' });
    }
};