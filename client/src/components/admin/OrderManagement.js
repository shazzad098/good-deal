// client/src/components/admin/OrderManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProducts.css'; // একই স্টাইল ব্যবহার করবে

// ✅ Axios instance তৈরি করুন
const api = axios.create({
    baseURL: '/api', // Shudhu '/api' hobe
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // ✅ GET /api/orders রুটটি অ্যাডমিন সুরক্ষিত আছে
            const res = await api.get('/orders');
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(order =>
                order._id === orderId ? res.data.order : order
            ));
        } catch (error) {
            console.error("Failed to update order status:", error);
            alert("Failed to update status");
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: '#f39c12', bg: '#fff3cd', label: 'Pending' },
            processing: { color: '#3498db', bg: '#d1ecf1', label: 'Processing' },
            shipped: { color: '#17a2b8', bg: '#d1ecf1', label: 'Shipped' },
            delivered: { color: '#27ae60', bg: '#d4edda', label: 'Delivered' },
            cancelled: { color: '#e74c3c', bg: '#f8d7da', label: 'Cancelled' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span style={{
                background: config.bg,
                color: config.color,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize'
            }}>
                {config.label}
            </span>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = statusFilter === 'all' || order.orderStatus === statusFilter;
        const matchesSearch = searchTerm === '' ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>Order Management</h1>
                <p>Manage and track customer orders efficiently</p>
            </div>

            {/* Filters */}
            <div className="products-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search orders by ID, customer name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="products-grid">
                {filteredOrders.length === 0 && (
                    <div className="empty-state" style={{gridColumn: '1 / -1'}}>
                        <div className="empty-icon">📋</div>
                        <h3>No Orders Found</h3>
                        <p>Orders will appear here as customers place them</p>
                    </div>
                )}

                {filteredOrders.map((order) => (
                    <div key={order._id} className="product-card">
                        <div className="product-info">
                            <div className="product-header">
                                <h3 className="product-name" style={{fontSize: '1rem', wordBreak: 'break-all'}}>ID: {order._id}</h3>
                                {getStatusBadge(order.orderStatus)}
                            </div>

                            <div style={{marginBottom: '20px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Customer:</span>
                                    <span style={{fontWeight: '600'}}>{order.user.name}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Email:</span>
                                    <span>{order.user.email}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Date:</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Amount:</span>
                                    <span style={{fontWeight: '700', color: '#4361ee'}}>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Items:</span>
                                    <span>{order.items.length} items</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <select
                                    className="filter-select"
                                    value={order.orderStatus}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    style={{flex: 1}}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManagement;