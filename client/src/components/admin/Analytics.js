import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('monthly');
    const [chartData, setChartData] = useState([]);

    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Simulate chart data based on time range
        const data = {
            daily: [65, 59, 80, 81, 56, 55, 40],
            weekly: [28, 48, 40, 19, 86, 27, 90],
            monthly: [12, 19, 3, 5, 2, 3, 15, 25, 32, 45, 28, 36]
        };
        setChartData(data[timeRange] || data.monthly);
    }, [timeRange]);

    const analyticsStats = [
        {
            icon: '💰',
            title: 'Total Revenue',
            value: '$12,450',
            change: '+12%',
            changeType: 'positive',
            description: 'From last month'
        },
        {
            icon: '📦',
            title: 'Total Orders',
            value: '324',
            change: '+15%',
            changeType: 'positive',
            description: 'From last month'
        },
        {
            icon: '👥',
            title: 'New Customers',
            value: '89',
            change: '+8%',
            changeType: 'positive',
            description: 'From last month'
        },
        {
            icon: '🛒',
            title: 'Conversion Rate',
            value: '3.2%',
            change: '-0.2%',
            changeType: 'negative',
            description: 'From last month'
        }
    ];

    const topProducts = [
        { name: 'iPhone 14 Pro', sales: 124, revenue: '$15,480' },
        { name: 'MacBook Air', sales: 89, revenue: '$12,450' },
        { name: 'AirPods Pro', sales: 156, revenue: '$4,680' },
        { name: 'iPad Air', sales: 67, revenue: '$6,700' }
    ];

    return (
        <div>
            <div className="dashboard-header">
                <h1>Analytics Dashboard</h1>
                <p>Track your store performance and key metrics</p>
            </div>

            {/* Time Range Selector */}
            <div className="quick-actions" style={{marginBottom: '30px'}}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                }}>
                    <h3>Performance Overview</h3>
                    <div className="filter-group">
                        <select
                            className="filter-select"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            style={{minWidth: '120px'}}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid" style={{marginBottom: '0'}}>
                    {analyticsStats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <h3>{stat.title}</h3>
                                <p className="stat-number">{stat.value}</p>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.8rem'
                                }}>
                                    <span style={{
                                        color: stat.changeType === 'positive' ? '#28a745' : '#dc3545',
                                        fontWeight: '600'
                                    }}>
                                        {stat.change}
                                    </span>
                                    <span style={{color: '#6c757d'}}>
                                        {stat.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
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
                        <div style={{fontSize: '3rem'}}>📊</div>
                        <div style={{textAlign: 'center'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: '600'}}>
                                Interactive Sales Chart
                            </div>
                            <div style={{opacity: 0.8}}>
                                Integrate with Chart.js, D3.js, or similar library
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Products */}
                <div className="quick-actions">
                    <h3>Top Products</h3>
                    <div style={{padding: '20px 0'}}>
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
                                    <div style={{fontWeight: '600', color: '#2b2d42'}}>
                                        {product.name}
                                    </div>
                                    <div style={{fontSize: '0.8rem', color: '#6c757d'}}>
                                        {product.sales} sales
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: '700',
                                    color: '#4361ee',
                                    fontSize: '0.9rem'
                                }}>
                                    {product.revenue}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="stats-grid">
                <div className="quick-actions">
                    <h3>Customer Metrics</h3>
                    <div style={{padding: '20px 0', textAlign: 'center'}}>
                        <div style={{fontSize: '2.5rem', marginBottom: '10px'}}>📈</div>
                        <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#2b2d42'}}>
                            Customer Analytics
                        </div>
                        <div style={{color: '#6c757d', marginTop: '10px'}}>
                            Retention rate, acquisition cost, and lifetime value
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h3>Inventory Health</h3>
                    <div style={{padding: '20px 0', textAlign: 'center'}}>
                        <div style={{fontSize: '2.5rem', marginBottom: '10px'}}>📦</div>
                        <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#2b2d42'}}>
                            Stock Analysis
                        </div>
                        <div style={{color: '#6c757d', marginTop: '10px'}}>
                            Low stock alerts and inventory turnover
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;