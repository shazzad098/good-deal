import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import './AdminDashboard.css';

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
                        <Route path="products" element={<ProductManagement />} />
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

// Dashboard Home Component (same as before)
const DashboardHome = () => {
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
                        <p className="stat-number">$12,450</p>
                        <span className="stat-trend positive">+12% from last month</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-number">156</p>
                        <span className="stat-trend positive">+5% from last month</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-number">892</p>
                        <span className="stat-trend positive">+8% from last month</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-number">324</p>
                        <span className="stat-trend positive">+15% from last month</span>
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

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-content">
                            <p>New product "Wireless Headphones" added</p>
                            <span className="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">💰</div>
                        <div className="activity-content">
                            <p>Order #1234 completed - $250.00</p>
                            <span className="activity-time">5 hours ago</span>
                        </div>
                    </div>
                    <div className="activity-item">
                        <div className="activity-icon">👥</div>
                        <div className="activity-content">
                            <p>New user registration - john@example.com</p>
                            <span className="activity-time">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;