import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <h3>Admin Panel</h3>
                <nav>
                    <Link
                        to="products"
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </Link>
                    <Link
                        to="orders"
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </Link>
                    <Link
                        to="users"
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </Link>
                </nav>
            </div>

            <div className="admin-content">
                <Routes>
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="/" element={<ProductManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;