import React from 'react';
import { useSelector } from 'react-redux';

const Cart = () => {
    const cart = useSelector(state => state.cart);

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            {cart.items && cart.items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items">
                    {/* Cart items will be displayed here */}
                    <p>Cart functionality will be implemented soon</p>
                </div>
            )}
        </div>
    );
};

export default Cart;