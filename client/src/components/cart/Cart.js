import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../../reducers/cartReducer';
import './Cart.css'; // নতুন CSS ফাইল ইম্পোর্ট

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, itemCount, total } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    const handleQuantityChange = (productId, newQuantity) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>You have {itemCount} item(s) in your cart</p>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items List */}
                        <div className="cart-items-list">
                            {items.map(item => (
                                <div key={item.product} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image || 'https://placehold.co/100x100/f3f4f6/9ca3af?text=Image'} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <Link to={`/products/${item.product}`} className="item-name">{item.name}</Link>
                                        <div className="item-price">${item.price.toFixed(2)}</div>
                                        <div className="item-stock">
                                            {item.quantity > item.stock ? 
                                                <span className="stock-error">Only {item.stock} in stock</span> :
                                                <span className="stock-ok">{item.stock} in stock</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button onClick={() => handleQuantityChange(item.product, item.quantity - 1)}>-</button>
                                            <input 
                                                type="number" 
                                                value={item.quantity} 
                                                onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value) || 1)} 
                                                min="1"
                                                max={item.stock}
                                            />
                                            <button onClick={() => handleQuantityChange(item.product, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                                        </div>
                                        <button onClick={() => handleRemove(item.product)} className="remove-btn">
                                            Remove
                                        </button>
                                    </div>
                                    <div className="cart-item-subtotal">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button onClick={handleCheckout} className="btn btn-primary checkout-btn">
                                Proceed to Checkout
                            </button>
                            <button onClick={() => dispatch(clearCart())} className="btn btn-outline clear-cart-btn">
                                Clear Cart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
