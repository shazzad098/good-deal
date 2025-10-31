// server/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// === PORIBORTON EKHANE ===
// GET /api/products - Get all products (Public)
// Ekhon eta category ebong limit query support korbe
router.get('/', async (req, res) => {
    try {
        const { category, limit } = req.query;

        // Ekta filter object toiri kora
        const filter = {};

        // Jodi URL-e category query thake, setake filter object-e add kora
        if (category) {
            filter.category = category;
        }
        
        // Database query toiri kora
        let query = Product.find(filter).sort({ createdAt: -1 });

        // Jodi limit query thake, setake apply kora
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        // Query execute kora
        const products = await query;
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
});
// ==========================

// GET /api/products/:id - Get single product (Public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product'
        });
    }
});

// POST /api/products - Create new product (Admin only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const productData = {
            ...req.body,
            status: req.body.stock > 0 ? 'active' : 'out-of-stock'
        };

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Auto-update status based on stock
        if (updateData.stock !== undefined) {
            updateData.status = updateData.stock > 0 ? 'active' : 'out-of-stock';
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product'
        });
    }
});

module.exports = router;