// client/src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './AdminProducts.css';

const api = axios.create({
    baseURL: '/api',
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

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const roleConfig = {
            admin: { color: '#e74c3c', bg: '#f8d7da', label: 'Admin' },
            user: { color: '#6c757d', bg: '#e9ecef', label: 'User' }
        };

        const config = roleConfig[role] || roleConfig.user;
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

    // (Note: User role update functionality needs a backend endpoint)
    const updateUserRole = (userId, newRole) => {
        console.log(`Updating user ${userId} to ${newRole} (needs backend implementation)`);
        // setUsers(prev => prev.map(user =>
        //     user._id === userId ? { ...user, role: newRole } : user
        // ));
    };

    const filteredUsers = users.filter(user => {
        const matchesFilter = roleFilter === 'all' || user.role === roleFilter;
        const matchesSearch = searchTerm === '' ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

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
                        <h3>Customers</h3>
                        <p className="stat-number">{users.filter(u => u.role === 'user').length}</p>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="products-grid">
                {filteredUsers.length === 0 && (
                    <div className="empty-state" style={{gridColumn: '1 / -1'}}>
                        <div className="empty-icon">👥</div>
                        <h3>No Users Found</h3>
                        <p>User accounts will appear here as they register</p>
                    </div>
                )}

                {filteredUsers.map((user) => (
                    <div key={user._id} className="product-card">
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
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="product-actions">
                                {currentUser._id !== user._id && (
                                    <select
                                        className="filter-select"
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        style={{flex: 1}}
                                        disabled // Role update API তৈরি না করা পর্যন্ত disabled
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                )}
                                {currentUser._id === user._id && (
                                    <p style={{textAlign: 'center', flex: 1, color: '#6c757d'}}> (Current User)</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;