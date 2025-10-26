import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: true,
        user: null
    },
    reducers: {
        loginSuccess: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload.user;
        },
        loginFail: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        },
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        },
        userLoaded: (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        }
    }
});

export const { loginSuccess, loginFail, logout, userLoaded } = authSlice.actions;
export default authSlice.reducer;