// client/src/actions/authActions.js
import axios from 'axios';

// Remove Alert (এটি অপরিবর্তিত)
export const removeAlert = (id) => ({
    type: 'REMOVE_ALERT',
    payload: id
});

// === পরিবর্তন এখানে ===
// Set Alert (এখন এটি একটি থাঙ্ক এবং নিজে থেকেই রিমুভ হয়)
export const setAlert = (msg, type, timeout = 1500) => (dispatch) => {
    const id = Date.now();
    dispatch({
        type: 'SET_ALERT',
        payload: { msg, type, id }
    });

    // নির্দিষ্ট সময় পর অটো রিমুভ
    setTimeout(() => {
        dispatch(removeAlert(id));
    }, timeout);
};

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

        // === পরিবর্তন: সংক্ষিপ্ত মেসেজ ও নতুন setAlert ব্যবহার ===
        dispatch(setAlert('Registered!', 'success'));
        // পুরানো setTimeout ব্লকটি রিমুভ করা হয়েছে

    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';

        dispatch({
            type: 'AUTH_ERROR',
            payload: message
        });

        // === পরিবর্তন: নতুন setAlert ব্যবহার ===
        dispatch(setAlert(message, 'error'));
        // পুরানো setTimeout ব্লকটি রিমুভ করা হয়েছে
    }
};

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

        // === পরিবর্তন: সংক্ষিপ্ত মেসেজ "Logged in!" ও নতুন setAlert ===
        dispatch(setAlert('Logged in!', 'success'));
        // পুরানো setTimeout ব্লকটি রিমুভ করা হয়েছে

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

        // === পরিবর্তন: নতুন setAlert ব্যবহার ===
        dispatch(setAlert(message, 'error'));
        // পুরানো setTimeout ব্লকটি রিমুভ করা হয়েছে
    }
};

// Logout User
export const logoutUser = () => (dispatch) => {
    dispatch({ type: 'LOGOUT' });
    // === পরিবর্তন: সংক্ষিপ্ত মেসেজ "Logged out!" ও নতুন setAlert ===
    dispatch(setAlert('Logged out!', 'success'));
};

// Load User
// client/src/actions/authActions.js - Add this if not exists
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