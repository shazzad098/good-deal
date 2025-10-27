import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AdminProducts.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrders([
                {
                    id: 'ORD-0012',
                    customer: 'John Doe',
                    email: 'john@example.com',
                    date: '2024-01-15',
                    amount: '$299.99',
                    status: 'completed',
                    items: 2
                },
                {
                    id: 'ORD-0011',
                    customer: 'Sarah Smith',
                    email: 'sarah@example.com',
                    date: '2024-01-14',
                    amount: '$156.50',
                    status: 'processing',
                    items: 1
                },
                {
                    id: 'ORD-0010',
                    customer: 'Mike Johnson',
                    email: 'mike@example.com',
                    date: '2024-01-13',
                    amount: '$599.99',
                    status: 'pending',
                    items: 3
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: '#ffc107', bg: '#fff3cd', label: 'Pending' },
            processing: { color: '#17a2b8', bg: '#d1ecf1', label: 'Processing' },
            completed: { color: '#28a745', bg: '#d4edda', label: 'Completed' },
            cancelled: { color: '#dc3545', bg: '#f8d7da', label: 'Cancelled' }
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

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

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
                        placeholder="Search orders by ID, customer, or email..."
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
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="products-grid">
                {orders.map((order) => (
                    <div key={order.id} className="product-card">
                        <div className="product-info">
                            <div className="product-header">
                                <h3 className="product-name">{order.id}</h3>
                                {getStatusBadge(order.status)}
                            </div>

                            <div style={{marginBottom: '20px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Customer:</span>
                                    <span style={{fontWeight: '600'}}>{order.customer}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Email:</span>
                                    <span>{order.email}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Date:</span>
                                    <span>{order.date}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Amount:</span>
                                    <span style={{fontWeight: '700', color: '#4361ee'}}>{order.amount}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Items:</span>
                                    <span>{order.items} items</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => {/* View order details */}}
                                >
                                    👁️ View
                                </button>
                                <select
                                    className="filter-select"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    style={{flex: 1}}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No Orders Found</h3>
                    <p>Orders will appear here as customers place them</p>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;