// client/src/components/admin/Analytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css'; // <-- আপনার অ্যানালিটিক্স CSS

// ===============================================
// ধাপ ১: Chart.js ইম্পোর্ট করুন
// ===============================================
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// ===============================================
// ধাপ ২: Chart.js রেজিস্টার করুন
// ===============================================
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Axios instance (আগের মতোই)
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

// StatCard কম্পোনেন্ট (আগের মতোই)
const StatCard = ({ icon, title, value, trend, trendType = 'positive', iconBgClass }) => (
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
);

// ===============================================
// ধাপ ৩: চার্টের জন্য অপশন এবং ডেমো ডেটা তৈরি করুন
// ===============================================
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false, // আমরা কার্ডের টাইটেল ব্যবহার করবো
        },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Revenue',
            // এই ডেটা আপনি আপনার API থেকে আনবেন
            data: [1200, 1900, 3000, 2500, 4200, 3800, 5000],
            borderColor: '#F97316', // আপনার নতুন কমলা থিম
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            tension: 0.3, // লাইনটিকে মসৃণ করতে
            fill: true,
        },
    ],
};


const Analytics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data);

                const productsRes = await api.get('/admin/products');
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
            {/* Performance Overview Section */}
            <div className="analytics-card" style={{marginBottom: '30px'}}>
                <h3 className="card-title">Performance Overview</h3>
                <div className="stats-grid" style={{marginBottom: '0'}}>
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
                        title="Total Customers" 
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
            </div>

            {/* Charts and Additional Data Grid */}
            <div className="analytics-grid">
                
                {/* Revenue Analytics Card */}
                <div className="analytics-card">
                    <h3 className="card-title">Revenue Analytics</h3>
                    
                    {/* =============================================== */}
                    {/* ধাপ ৪: Placeholder-এর বদলে চার্ট বসান */}
                    {/* =============================================== */}
                    <div style={{ height: '350px' }}> {/* চার্টের উচ্চতা ঠিক রাখতে */}
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* Top Selling Products Card (আগের মতোই) */}
                <div className="analytics-card">
                    <h3 className="card-title">Top Selling Products</h3>
                    <ul className="top-products-list">
                        {topProducts.length === 0 && <p>No products found.</p>}
                        {topProducts.map((product, index) => (
                            <li key={index} className="top-product-item">
                                <div className="top-product-rank">
                                    {index + 1}
                                </div>
                                <div className="top-product-info">
                                    <div className="top-product-name">
                                        {product.name}
                                    </div>
                                    <div className="top-product-sales">
                                        {product.sales} sales (mock)
                                    </div>
                                </div>
                                <div className="top-product-revenue">
                                    ${product.revenue.toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Analytics;