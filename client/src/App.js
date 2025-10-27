// client/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import Home from './components/pages/Home';
import Products from './components/products/Products';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/cart/Cart';
import Checkout from './components/order/Checkout';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import { loadUser } from './actions/authActions';

// App Content Component
const AppContent = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Load user when app starts
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                {/* Show navbar only for non-admin users */}
                {(!user || user.role !== 'admin') && <Navbar />}

                <Alert />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<Products />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<Cart />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />

                        {/* Regular protected routes */}
                        <Route
                            path="/checkout"
                            element={
                                <PrivateRoute>
                                    <Checkout />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>

                {/* Show footer only for non-admin users */}
                {(!user || user.role !== 'admin') && <Footer />}
            </div>
        </Router>
    );
};

// Main App Component
function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;