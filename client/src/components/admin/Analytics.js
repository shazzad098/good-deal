// client/src/components/admin/Analytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

const Analytics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);

    // Note: Top products and chart data would require more complex backend endpoints
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                // Fetch main stats
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data);

                // Fetch top products (using product route for now, ideally needs aggregation)
                const productsRes = await api.get('/admin/products');
                // Mocking sales data, as backend doesn't provide it
                const productsWithSales = productsRes.data.products.slice(0, 4).map((p, i) => ({
                    ...p,
                    sales: 100 - i * 15, // Mock sales
                    revenue: (100 - i * 15) * p.price
                }));
                setTopProducts(productsWithSales);

            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="dashboard-header">
                <h1>Analytics Dashboard</h1>
                <p>Track your store performance and key metrics</p>
            </div>

            <div className="quick-actions" style={{marginBottom: '30px'}}>
                <h3>Performance Overview</h3>
                {/* Stats Grid */}
                <div className="stats-grid" style={{marginBottom: '0'}}>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>Total Revenue</h3>
                            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p className="stat-number">{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>Total Customers</h3>
                            <p className="stat-number">{stats.totalUsers}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>Total Products</h3>
                            <p className="stat-number">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Additional Data */}
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '30px'}}>
                {/* Main Chart */}
                <div className="quick-actions">
                    <h3>Sales Overview</h3>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        height: '300px',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        <div style={{fontSize: '3rem'}}>📈</div>
                        <div style={{textAlign: 'center'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: '600'}}>
                                Interactive Sales Chart
                            </div>
                            <div style={{opacity: 0.8}}>
                                (Chart.js integration needed)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="quick-actions">
                    <h3>Top Products</h3>
                    <div style={{padding: '20px 0'}}>
                        {topProducts.length === 0 && <p>No products found.</p>}
                        {topProducts.map((product, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px 0',
                                borderBottom: index < topProducts.length - 1 ? '1px solid #eee' : 'none'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: '600'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: '600', color: '#2b2d42', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                        {product.name}
                                    </div>
                                    <div style={{fontSize: '0.8rem', color: '#6c757d'}}>
                                        {product.sales} sales (mock)
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: '700',
                                    color: '#4361ee',
                                    fontSize: '0.9rem'
                                }}>
                                    ${product.revenue.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;