const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        // === PORIBORTON EKHANE ===
        // enum (fixed list) remove kora holo
        // enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Automotive']
        // ==========================
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'out-of-stock', 'inactive'],
        default: 'active'
    },
    features: [String],
    specifications: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);