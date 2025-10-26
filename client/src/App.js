import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import Home from './components/pages/Home';
import Products from './components/products/Products';
import Product from './components/products/Product';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Cart from './components/cart/Cart';
import Checkout from './components/order/Checkout';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminProducts from './components/admin/AdminProducts';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Navbar />
                    <Alert />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Product />} />
                            <Route path="/products/:id" element={<Product />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route
                                path="/checkout"
                                element={
                                    <PrivateRoute>
                                        <Checkout />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/*"
                                element={
                                    <PrivateRoute admin={true}>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer /> {/* Add Footer here */}
                </div>
            </Router>
        </Provider>
    );
}

export default App;