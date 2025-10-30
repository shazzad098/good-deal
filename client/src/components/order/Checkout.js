import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart } from '../../reducers/cartReducer';
import { setAlert } from '../../actions/authActions';
import './Checkout.css'; // নতুন CSS ফাইল

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state থেকে তথ্য নিন
    const { items, total, itemCount } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);

    // Shipping form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'Bangladesh',
    });

    // Fake payment form state
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
    });

    const [loading, setLoading] = useState(false);

    // ব্যবহারকারী লগইন করা থাকলে ফর্ম প্রি-ফিল করুন
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [user]);

    // Input handlers
    const handleShippingChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    // Order submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (items.length === 0) {
            dispatch(setAlert('Your cart is empty', 'error'));
            navigate('/cart');
            return;
        }

        setLoading(true);

        // সার্ভারের জন্য অর্ডার ডেটা প্রস্তুত করুন
        const shippingAddress = {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
        };

        const orderData = {
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: total,
            shippingAddress: shippingAddress,
            // অন্য তথ্য যেমন paymentMethod, paymentStatus এখানে যোগ করা যেতে পারে
        };

        try {
            // API কল (সার্ভারে অর্ডার পাঠান)
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // '/api/orders' রুটে POST রিকোয়েস্ট করুন (orders.js অনুযায়ী)
            const res = await axios.post('/api/orders', orderData, config);

            if (res.data.success) {
                dispatch(setAlert('Order placed successfully!', 'success'));
                dispatch(clearCart());
                navigate('/'); // অথবা একটি "Thank You" পেজে পাঠান
            } else {
                throw new Error(res.data.message || 'Order placement failed');
            }

        } catch (error) {
            console.error('Order submission error:', error);
            dispatch(setAlert(error.response?.data?.message || 'Order failed. Please try again.', 'error'));
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        
                        {/* Left Column: Forms */}
                        <div className="checkout-forms">
                            {/* Shipping Card */}
                            <div className="checkout-card">
                                <h2>Shipping Information</h2>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleShippingChange} required />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleShippingChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone</label>
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleShippingChange} placeholder="+8801..." required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="street">Street Address</label>
                                    <input type="text" id="street" name="street" value={formData.street} onChange={handleShippingChange} placeholder="House no. and street name" required />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="city">City</label>
                                        <input type="text" id="city" name="city" value={formData.city} onChange={handleShippingChange} placeholder="Dhaka" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="postalCode">Postal Code</label>
                                        <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleShippingChange} placeholder="1212" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select id="country" name="country" value={formData.country} onChange={handleShippingChange}>
                                        <option value="Bangladesh">Bangladesh</option>
                                        {/* Other countries can be added here */}
                                    </select>
                                </div>
                            </div>

                            {/* Payment Card (Demo) */}
                            <div className="checkout-card">
                                <h2>Payment Details</h2>
                                <div className="payment-demo-note">
                                    <strong>This is a demo.</strong> Do not enter real credit card information.
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input type="text" id="cardNumber" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9101 1121" required />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="expiry">Expiry Date</label>
                                        <input type="text" id="expiry" name="expiry" value={paymentData.expiry} onChange={handlePaymentChange} placeholder="MM / YY" required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cvc">CVC</label>
                                        <input type="text" id="cvc" name="cvc" value={paymentData.cvc} onChange={handlePaymentChange} placeholder="123" required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="checkout-summary">
                            <div className="checkout-card summary-card">
                                <h2>Order Summary</h2>
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
                                <button type="submit" className="btn btn-primary checkout-btn" disabled={loading || items.length === 0}>
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;