// client/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import axios from 'axios'; // ✅ axios ইম্পোর্ট করুন

// ✅ FIX: সঠিক প্রোডাক্ট কম্পোনেন্ট ইম্পোর্ট করুন
import AdminProducts from './AdminProducts';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import './AdminDashboard.css';

// ✅ Axios instance তৈরি করুন
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
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


const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile menu
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        setActiveTab(path || 'dashboard');
    }, [location]);

    // Toggle sidebar visibility on mobile
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar when navigating on mobile
    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    // Double check if user is admin
    if (!user || user.role !== 'admin') {
        return (
            <div className="admin-access-denied">
                <div className="access-denied-content">
                    <h2>🚫 Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            {/* Admin Header */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-brand">
                        <h2>🛍️ GoodDeal Admin</h2>
                    </div>
                    {/* Hamburger Menu Button (Visible only on mobile) */}
                    <button
                        className="hamburger-menu"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    >
                        <div className={`hamburger-line ${isSidebarOpen ? 'top' : ''}`}></div>
                        <div className={`hamburger-line ${isSidebarOpen ? 'middle' : ''}`}></div>
                        <div className={`hamburger-line ${isSidebarOpen ? 'bottom' : ''}`}></div>
                    </button>
                    <div className="admin-header-actions">
                        <span className="admin-welcome">
                            Welcome, {user?.name}
                        </span>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-outline"
                        >
                            View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-layout">
                {/* Sidebar / Mobile Menu */}
                <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="admin-profile">
                        <div className="admin-avatar">👨‍💼</div>
                        <div className="admin-info">
                            <h4>{user?.name || 'Admin'}</h4>
                            <span className="admin-badge">Administrator</span>
                        </div>
                    </div>

                    <nav className="admin-nav">
                        <Link
                            to="dashboard"
                            className={activeTab === 'dashboard' ? 'active' : ''}
                            onClick={() => { setActiveTab('dashboard'); handleNavClick(); }}
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="products"
                            className={activeTab === 'products' ? 'active' : ''}
                            onClick={() => { setActiveTab('products'); handleNavClick(); }}
                        >
                            📦 Products
                        </Link>
                        <Link
                            to="orders"
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => { setActiveTab('orders'); handleNavClick(); }}
                        >
                            📋 Orders
                        </Link>
                        <Link
                            to="users"
                            className={activeTab === 'users' ? 'active' : ''}
                            onClick={() => { setActiveTab('users'); handleNavClick(); }}
                        >
                            👥 Users
                        </Link>
                        <Link
                            to="analytics"
                            className={activeTab === 'analytics' ? 'active' : ''}
                            onClick={() => { setActiveTab('analytics'); handleNavClick(); }}
                        >
                            📈 Analytics
                        </Link>
                    </nav>
                </div>

                {/* Overlay for mobile menu */}
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                )}

                <div className="admin-content">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />
                        {/* ✅ FIX: সঠিক কম্পোনেন্ট ব্যবহার করুন */}
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="/" element={<DashboardHome />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

// Dashboard Home Component (Live Data সহ)
const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to your administration panel. Manage your store efficiently.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
                        <span className="stat-trend positive">From all orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-number">{stats.totalProducts}</p>
                        <span className="stat-trend positive">In catalog</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                        <span className="stat-trend positive">Registered users</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats.totalOrders}</p>
                        <span className="stat-trend positive">Received</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="products" className="action-btn">
                        <span className="action-icon">➕</span>
                        Add New Product
                    </Link>
                    <Link to="users" className="action-btn">
                        <span className="action-icon">👥</span>
                        Manage Users
                    </Link>
                    <Link to="analytics" className="action-btn">
                        <span className="action-icon">📊</span>
                        View Reports
                    </Link>
                    <Link to="orders" className="action-btn">
                        <span className="action-icon">📋</span>
                        Process Orders
                    </Link>
                </div>
            </div>

            {/* Recent activity can be implemented later by fetching recent orders/users */}
        </div>
    );
};

export default AdminDashboard;