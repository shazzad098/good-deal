import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        loading: false
    },
    reducers: {
        addToCart: (state, action) => {
            // Cart functionality will be implemented later
        },
        removeFromCart: (state, action) => {
            // Cart functionality will be implemented later
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;