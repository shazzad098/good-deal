import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AdminProducts.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');

    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setUsers([
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'admin',
                    joinDate: '2024-01-01',
                    status: 'active',
                    orders: 12
                },
                {
                    id: 2,
                    name: 'Sarah Smith',
                    email: 'sarah@example.com',
                    role: 'customer',
                    joinDate: '2024-01-05',
                    status: 'active',
                    orders: 5
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    email: 'mike@example.com',
                    role: 'customer',
                    joinDate: '2024-01-10',
                    status: 'inactive',
                    orders: 0
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { color: '#dc3545', bg: '#f8d7da', label: 'Admin' },
            customer: { color: '#6c757d', bg: '#e9ecef', label: 'Customer' },
            vendor: { color: '#fd7e14', bg: '#ffe5d0', label: 'Vendor' }
        };

        const config = roleConfig[role] || roleConfig.customer;
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

    const getStatusBadge = (status) => {
        return (
            <span style={{
                background: status === 'active' ? '#d4edda' : '#f8d7da',
                color: status === 'active' ? '#155724' : '#721c24',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize'
            }}>
                {status}
            </span>
        );
    };

    const updateUserRole = (userId, newRole) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    const toggleUserStatus = (userId) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? {
                ...user,
                status: user.status === 'active' ? 'inactive' : 'active'
            } : user
        ));
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>User Management</h1>
                <p>Manage user accounts and permissions</p>
            </div>

            {/* User Stats */}
            <div className="stats-grid" style={{marginBottom: '30px'}}>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-number">{users.length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <h3>Active Customers</h3>
                        <p className="stat-number">{users.filter(u => u.role === 'customer' && u.status === 'active').length}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👑</div>
                    <div className="stat-info">
                        <h3>Administrators</h3>
                        <p className="stat-number">{users.filter(u => u.role === 'admin').length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="products-toolbar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                    />
                </div>
                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="products-grid">
                {users.map((user) => (
                    <div key={user.id} className="product-card">
                        <div className="product-info">
                            <div className="product-header">
                                <h3 className="product-name">{user.name}</h3>
                                {getRoleBadge(user.role)}
                            </div>

                            <div style={{marginBottom: '20px'}}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Join Date:</span>
                                    <span>{user.joinDate}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Status:</span>
                                    {getStatusBadge(user.status)}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{color: '#6c757d', fontSize: '0.9rem'}}>Orders:</span>
                                    <span>{user.orders} orders</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className="btn btn-outline"
                                    onClick={() => toggleUserStatus(user.id)}
                                >
                                    {user.status === 'active' ? '⏸️ Suspend' : '▶️ Activate'}
                                </button>
                                {currentUser.id !== user.id && (
                                    <select
                                        className="filter-select"
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                        style={{flex: 1}}
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No Users Found</h3>
                    <p>User accounts will appear here as they register</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;