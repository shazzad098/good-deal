// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gooddeal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.log('❌ MongoDB Connection Error:', err);
        console.log('📌 Connection string:', process.env.MONGODB_URI);
    });

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// === PORIBORTON EKHANE ===
// Serve uploaded files statically
// Ekhon /uploads path-e file-gulo access kora jabe
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ==========================

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'GoodDeal API is running...',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            orders: '/api/orders',
            admin: '/api/admin'
        }
    });
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ✅ FIXED: 404 handler for undefined API routes
app.use((req, res, next) => {
    // শুধু /api দিয়ে শুরু হওয়া undefined routes এর জন্য
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: 'API route not found',
            requestedUrl: req.originalUrl,
            availableRoutes: [
                'GET /',
                'GET /api/health',
                'POST /api/auth/register',
                'POST /api/auth/login',
                'GET /api/products',
                'GET /api/products/:id',
                'POST /api/products (admin)',
                'PUT /api/products/:id (admin)',
                'DELETE /api/products/:id (admin)',
                'GET /api/orders',
                'GET /api/orders/my-orders',
                'POST /api/orders'
            ]
        });
    }
    next();
});

// ✅ FIXED: Catch-all handler for non-API routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Please use API routes starting with /api/',
        example: 'http://localhost:5000/api/products'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('🚨 Global Error Handler:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Using cloud MongoDB' : 'Using local MongoDB'}`);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🚀 Server started successfully!');
});