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

// ============================================================================
// API সেটআপ (Axios Instance)
// ============================================================================
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // আপনার API বেস URL
    timeout: 10000,
});

// Axios ইন্টারসেপ্টর (টোকেন স্বয়ংক্রিয়ভাবে অ্যাড করার জন্য)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // অথবা Redux state থেকে
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
// কাস্টম হুকস (লজিক আলাদা করা)
// ============================================================================

/**
 * Hook: ইউজারের অথেন্টিকেশন এবং অ্যাডমিন রোল চেক করে।
 */
const useAdminAuth = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user.role !== 'admin') {
            navigate('/'); // অ্যাডমিন না হলে হোম পেজে রিডাইরেক্ট করুন
        } else {
            setIsAdmin(true);
        }
    }, [user, isAuthenticated, navigate]);

    return { isAdmin, user };
};

/**
 * Hook: অ্যাডমিন সাইডবার স্টেট (মোবাইল) পরিচালনা করে।
 */
const useAdminSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    return { isSidebarOpen, toggleSidebar, handleNavClick };
};

/**
 * Hook: ড্যাশবোর্ডের পরিসংখ্যান ফেচ করে।
 */
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

/**
 * Hook: বর্তমান অ্যাক্টিভ ট্যাব ট্র্যাক করে।
 */
const useActiveTab = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const path = location.pathname.split('/').pop();
        setActiveTab(path || 'dashboard');
    }, [location]);

    return { activeTab, setActiveTab };
};


// ============================================================================
// সাব-কম্পোনেন্ট (UI বিভাজন)
// ============================================================================

/**
 * অ্যাডমিন হেডার
 */
const AdminHeader = memo(({ user, onLogout, onToggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    return (
        <div className="admin-header">
            <div className="admin-header-content">
                <div className="admin-brand">
                    <h2>🛍️ GoodDeal Admin</h2>
                </div>
                <button
                    className="hamburger-menu"
                    onClick={onToggleSidebar}
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
                        onClick={onLogout}
                        className="btn btn-danger"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
});

/**
 * অ্যাডমিন সাইডবার (নেভিগেশন)
 */
const AdminSidebar = memo(({ user, activeTab, setActiveTab, handleNavClick, isSidebarOpen }) => {
    const navItems = useMemo(() => [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'products', label: 'Products', icon: '📦' },
        { key: 'orders', label: 'Orders', icon: '📋' },
        { key: 'users', label: 'Users', icon: '👥' },
        { key: 'analytics', label: 'Analytics', icon: '📈' },
    ], []);

    return (
        <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="admin-profile">
                <div className="admin-avatar">👨‍💼</div>
                <div className="admin-info">
                    <h4>{user?.name || 'Admin'}</h4>
                    <span className="admin-badge">Administrator</span>
                </div>
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
        </div>
    );
});

/**
 * Stat Card (ড্যাশবোর্ড হোম)
 */
const StatCard = memo(({ icon, title, value, label }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h3>{title}</h3>
            <p className="stat-number">{value}</p>
            <span className="stat-trend positive">{label}</span>
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
            <Link to="products" className="action-btn">
                <span className="action-icon">➕</span> Add New Product
            </Link>
            <Link to="users" className="action-btn">
                <span className="action-icon">👥</span> Manage Users
            </Link>
            <Link to="analytics" className="action-btn">
                <span className="action-icon">📊</span> View Reports
            </Link>
            <Link to="orders" className="action-btn">
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
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to your administration panel. Manage your store efficiently.</p>
            </div>
            <div className="stats-grid">
                <StatCard 
                    icon="💰" 
                    title="Total Revenue" 
                    value={`$${stats.totalRevenue.toFixed(2)}`} 
                    label="From all orders" 
                />
                <StatCard 
                    icon="📦" 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    label="In catalog" 
                />
                <StatCard 
                    icon="👥" 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    label="Registered users" 
                />
                <StatCard 
                    icon="📋" 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    label="Received" 
                />
            </div>
            <QuickActions />
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
    
    // কাস্টম হুকস কল করা
    const { isAdmin, user } = useAdminAuth();
    const { isSidebarOpen, toggleSidebar, handleNavClick } = useAdminSidebar();
    const { activeTab, setActiveTab } = useActiveTab();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    // যদি অ্যাডমিন না হয়, Access Denied দেখাবে
    if (!isAdmin) {
        return <AdminAccessDenied />;
    }

    // অ্যাডমিন হলে ড্যাশবোর্ড লেআউট দেখাবে
    return (
        <div className="admin-dashboard">
            <AdminHeader 
                user={user}
                onLogout={handleLogout}
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />

            <div className="admin-layout">
                <AdminSidebar 
                    user={user}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleNavClick={handleNavClick}
                    isSidebarOpen={isSidebarOpen}
                />

                {/* Overlay for mobile menu */}
                {isSidebarOpen && (
                    <div className="sidebar-overlay" onClick={toggleSidebar}></div>
                )}

                <div className="admin-content">
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />
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

export default AdminDashboard;