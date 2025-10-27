// client/src/reducers/authReducer.js
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true, // Start with loading true
    user: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_LOADING':
            return {
                ...state,
                loading: true
            };
        case 'REGISTER_SUCCESS':
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
                user: action.payload.user // Make sure user data is stored
            };
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;