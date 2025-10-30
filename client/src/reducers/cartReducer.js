import { createSlice } from '@reduxjs/toolkit';

// Helper function to save state to localStorage
const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (e) {
        console.warn('Could not save cart to localStorage', e);
    }
};

// Helper function to load state from localStorage
const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return { items: [], total: 0, itemCount: 0 };
        }
        const parsedState = JSON.parse(serializedState);
        // Ensure all required fields are present
        return {
            items: parsedState.items || [],
            total: parsedState.total || 0,
            itemCount: parsedState.itemCount || 0
        };
    } catch (e) {
        console.warn('Could not load cart from localStorage', e);
        return { items: [], total: 0, itemCount: 0 };
    }
};

// Helper function to calculate totals
const calculateTotals = (items) => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return { itemCount, total };
};

const initialState = loadFromLocalStorage();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.product === newItem.product);

            if (existingItem) {
                // Item exists, update quantity
                const newQuantity = existingItem.quantity + newItem.quantity;
                if (newQuantity <= newItem.stock) {
                    existingItem.quantity = newQuantity;
                } else {
                    // Optional: alert user that stock limit reached
                    console.warn(`Cannot add more. Stock limit (${newItem.stock}) reached.`);
                    existingItem.quantity = newItem.stock; // Set to max stock
                }
            } else {
                // Item does not exist, add to cart
                if (newItem.quantity <= newItem.stock) {
                    state.items.push({ ...newItem });
                } else {
                    console.warn(`Cannot add. Stock limit (${newItem.stock}) reached.`);
                    state.items.push({ ...newItem, quantity: newItem.stock });
                }
            }

            // Recalculate totals and save
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
            saveToLocalStorage(state);
        },

        removeFromCart: (state, action) => {
            const productIdToRemove = action.payload;
            state.items = state.items.filter(item => item.product !== productIdToRemove);

            // Recalculate totals and save
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
            saveToLocalStorage(state);
        },

        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const itemToUpdate = state.items.find(item => item.product === productId);

            if (itemToUpdate) {
                if (quantity <= 0) {
                    // Remove item if quantity is 0 or less
                    state.items = state.items.filter(item => item.product !== productId);
                } else if (quantity <= itemToUpdate.stock) {
                    itemToUpdate.quantity = quantity;
                } else {
                    itemToUpdate.quantity = itemToUpdate.stock; // Set to max stock
                }
            }

            // Recalculate totals and save
            const { itemCount, total } = calculateTotals(state.items);
            state.itemCount = itemCount;
            state.total = total;
            saveToLocalStorage(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
            saveToLocalStorage(state);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
