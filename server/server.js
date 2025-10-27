// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS setup
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Database connection - ETA CHANGE KORUN
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gooddeal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.log('❌ MongoDB Connection Error:', err);
        console.log('📌 Connection string:', process.env.MONGODB_URI);
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Using cloud MongoDB' : 'Using local MongoDB'}`);
});