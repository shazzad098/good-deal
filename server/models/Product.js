// server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [String],
    stock: {
        type: Number,
        default: 0
    },
    features: [String],
    specifications: {
        type: Map,
        of: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);