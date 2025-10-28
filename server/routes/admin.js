// server/routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Order = require('../models/Order');

// Middleware to check if user is admin
router.use(auth, admin);

// GET all products (Admin only)
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST - Create new product (Admin only)
// ✅ FIX: Improved Error Handling
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Automatically set status based on stock
        const status = stock > 0 ? 'active' : 'out-of-stock';

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: images && images.length > 0 ? images.filter(img => img) : ['https://via.placeholder.com/300'],
            status
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        // ✅ FIX: Send Mongoose validation error instead of generic 500
        console.error('Error creating product:', error);
        res.status(400).json({
            success: false,
            message: error.message // This will show the exact validation error
        });
    }
});

// PUT - Update product (Admin only)
// ✅ FIX: Improved Error Handling
router.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Automatically update status based on stock
        const status = stock > 0 ? 'active' : 'out-of-stock';

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                stock,
                images: images && images.length > 0 ? images.filter(img => img) : product.images,
                status
            },
            { new: true, runValidators: true } // runValidators ensures enum is checked
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        // ✅ FIX: Send Mongoose validation error instead of generic 500
        console.error('Error updating product:', error);
        res.status(400).json({
            success: false,
            message: error.message // This will show the exact validation error
        });
    }
});

// DELETE - Delete product (Admin only)
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET all users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// GET stats (Admin only)
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;

        res.json({
            success: true,
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


module.exports = router;