// client/src/components/admin/AdminDashboard.js
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import axios from 'axios';
import AdminProducts from './AdminProducts';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import './AdminDashboard.css';

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

// ============================================================================
// কাস্টম হুকস
// ============================================================================

const useAdminAuth = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user.role !== 'admin') {
            navigate('/');
        } else {
            setIsAdmin(true);
        }
    }, [user, isAuthenticated, navigate]);

    return { isAdmin, user };
};

const useAdminSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleNavClick = () => {
        if (window.innerWidth <= 1024) {
            setIsSidebarOpen(false);
        }
    };

    return { isSidebarOpen, setIsSidebarOpen, toggleSidebar, handleNavClick };
};

const useDashboardStats = () => {
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

    return { stats, loading };
};

const useActiveTab = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pageTitle, setPageTitle] = useState('Dashboard');

    const tabTitleMap = useMemo(() => ({
        'dashboard': 'Dashboard',
        'products': 'Product Management',
        'orders': 'Order Management',
        'users': 'User Management',
        'analytics': 'Analytics',
    }), []);

    useEffect(() => {
        const path = location.pathname.split('/admin/').pop().split('/')[0] || 'dashboard';
        setActiveTab(path);
        setPageTitle(tabTitleMap[path] || 'Dashboard');
    }, [location, tabTitleMap]);

    return { activeTab, pageTitle, setActiveTab };
};


// ============================================================================
// সাব-কম্পোনেন্ট
// ============================================================================

/**
 * কন্টেন্ট এরিয়ার হেডার
 */
const AdminContentHeader = memo(({ user, pageTitle, onLogout, onToggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    return (
        <div className="admin-content-header">
            <div className="header-left">
                <button
                    className="hamburger-menu"
                    onClick={onToggleSidebar}
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                >
                    <div className={`hamburger-line ${isSidebarOpen ? 'top' : ''}`}></div>
                    <div className={`hamburger-line ${isSidebarOpen ? 'middle' : ''}`}></div>
                    <div className={`hamburger-line ${isSidebarOpen ? 'bottom' : ''}`}></div>
                </button>
                <h1 className="content-page-title">{pageTitle}</h1>
            </div>
            
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
                    onClick={onLogout}
                    className="btn btn-danger"
                >
                    Logout
                </button>
            </div>
        </div>
    );
});

/**
 * অ্যাডমিন সাইডবার (নেভিগেশন)
 */
// 
// ===== পরিবর্তন এখানে =====
// onLogout এবং navigate prop হিসেবে যোগ করা হয়েছে
//
const AdminSidebar = memo(({ activeTab, setActiveTab, handleNavClick, isSidebarOpen, onLogout, navigate }) => {
    const navItems = useMemo(() => [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'products', label: 'Products', icon: '📦' },
        { key: 'orders', label: 'Orders', icon: '📋' },
        { key: 'users', label: 'Users', icon: '👥' },
        { key: 'analytics', label: 'Analytics', icon: '📈' },
    ], []);

    return (
        <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="admin-sidebar-header">
                <h2>🛍️ GoodDeal</h2>
            </div>
            
            <nav className="admin-nav">
                {navItems.map(item => (
                    <Link
                        key={item.key}
                        to={item.key}
                        className={activeTab === item.key ? 'active' : ''}
                        onClick={() => { setActiveTab(item.key); handleNavClick(); }}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
            </nav>

            {/* // ===== পরিবর্তন এখানে =====
            // মোবাইল ভিউয়ের জন্য বাটনগুলো সাইডবারের নিচে যোগ করা হয়েছে
            // */}
            <div className="admin-sidebar-mobile-actions">
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline"
                >
                    View Site
                </button>
                <button
                    onClick={onLogout}
                    className="btn btn-danger"
                >
                    Logout
                </button>
            </div>
        </div>
    );
});

/**
 * Stat Card (ড্যাশবোর্ড হোম)
 */
const StatCard = memo(({ icon, title, value, trend, trendType = 'positive', iconBgClass }) => (
    <div className="stat-card">
        <div className="stat-info">
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
            <span className={`stat-trend ${trendType}`}>
                {trendType === 'positive' ? '▲' : '▼'} {trend}
            </span>
        </div>
        <div className={`stat-icon-wrapper ${iconBgClass}`}>
            {icon}
        </div>
    </div>
));


/**
 * Quick Actions (ড্যাশবোর্ড হোম)
 */
const QuickActions = memo(() => (
    <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
            <Link to="../products" className="action-btn">
                <span className="action-icon">➕</span> Add New Product
            </Link>
            <Link to="../users" className="action-btn">
                <span className="action-icon">👥</span> Manage Users
            </Link>
            <Link to="../analytics" className="action-btn">
                <span className="action-icon">📊</span> View Reports
            </Link>
            <Link to="../orders" className="action-btn">
                <span className="action-icon">📋</span> Process Orders
            </Link>
        </div>
    </div>
));

/**
 * Dashboard Home Page (Routable Component)
 */
const DashboardHome = () => {
    const { stats, loading } = useDashboardStats();

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
            <div className="stats-grid">
                <StatCard 
                    icon="💰" 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue.toFixed(2)}`} 
                    trend="11.5%" 
                    trendType="positive"
                    iconBgClass="sales"
                />
                <StatCard 
                    icon="📋" 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    trend="3.1%"
                    trendType="negative"
                    iconBgClass="orders"
                />
                <StatCard 
                    icon="👥" 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    trend="+5 New"
                    trendType="positive"
                    iconBgClass="customers"
                />
                <StatCard 
                    icon="📦" 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    trend="+2 New"
                    trendType="positive"
                    iconBgClass="products"
                />
            </div>
            <QuickActions />

            <div className="charts-placeholder-grid">
                <div className="chart-placeholder large">
                    <span className="chart-icon">📈</span>
                    Sales Analytic Chart
                </div>
            </div>
        </div>
    );
};

/**
 * Access Denied Page (Routable Component)
 */
const AdminAccessDenied = () => {
    const navigate = useNavigate();
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
};

// ============================================================================
// প্রধান কম্পোনেন্ট (AdminDashboard)
// ============================================================================
const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { isAdmin, user } = useAdminAuth();
    const { isSidebarOpen, setIsSidebarOpen, toggleSidebar, handleNavClick } = useAdminSidebar();
    const { activeTab, pageTitle, setActiveTab } = useActiveTab();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isSidebarOpen && window.innerWidth <= 1024) {
                if (!e.target.closest('.admin-sidebar') && !e.target.closest('.hamburger-menu')) {
                    setIsSidebarOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isSidebarOpen, setIsSidebarOpen]);


    if (!isAdmin) {
        return <AdminAccessDenied />;
    }

    return (
        <div className="admin-dashboard">
            {/* // ===== পরিবর্তন এখানে =====
            // onLogout এবং navigate prop দুটি পাস করা হয়েছে
            // */}
            <AdminSidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleNavClick={handleNavClick}
                isSidebarOpen={isSidebarOpen}
                onLogout={handleLogout}
                navigate={navigate}
            />

            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            <div className="admin-content">
                <AdminContentHeader
                    user={user}
                    pageTitle={pageTitle}
                    onLogout={handleLogout}
                    onToggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                />
                
                <main className="admin-content-main">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element = {<OrderManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="/" element={<DashboardHome />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;