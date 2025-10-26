// client/src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
import cartReducer from './reducers/cartReducer';

export default configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer
    }
});