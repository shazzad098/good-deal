// server/models/Product.js
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
    originalPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'clothing', 'books', 'home', 'sports']
    },
    brand: {
        type: String,
        default: 'Generic'
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    images: [{
        type: String
    }],
    features: [{
        type: String
    }],
    sku: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Generate SKU before saving
productSchema.pre('save', function(next) {
    if (!this.sku) {
        this.sku = 'GD' + Date.now().toString().slice(-8);
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);