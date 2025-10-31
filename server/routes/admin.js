// server/routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Order = require('../models/Order');

// === MULTER SETUP START ===
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directory ensure kora
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // File kothay save hobe
    },
    filename: function (req, file, cb) {
        // Unique filename toiri kora
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// === MULTER SETUP END ===


// Middleware to check if user is admin
router.use(auth, admin);

// === NOTUN ROUTE: Get all unique categories ===
router.get('/categories', async (req, res) => {
    try {
        // Database theke shob unique category name ber kora
        const categories = await Product.distinct('category');
        res.json({
            success: true,
            categories: categories.filter(c => c) // null/empty values baad deya
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// ============================================

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
// === PORIBORTON: Multer middleware add kora hoyeche (upload.array('images')) ===
router.post('/products', upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Image path-gulo req.files theke neya
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            // path-gulo format kora (e.g., /uploads/image-123.jpg)
            imagePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
        } else {
            imagePaths = ['https://via.placeholder.com/300'];
        }

        const status = stock > 0 ? 'active' : 'out-of-stock';

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: imagePaths, // Database-e image path save kora
            status
        });

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
// =========================================================================

// PUT - Update product (Admin only)
// === PORIBORTON: Multer middleware add kora hoyeche ===
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category, stock, existingImages } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Notun image path-gulo req.files theke neya
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            newImagePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
        }

        // Purono image (jodi user rekhe dey) ebong notun image path combine kora
        let allImages = [];
        if (existingImages) {
            // ensure existingImages is an array (jodi ekta string ashe)
            allImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }
        allImages = [...allImages, ...newImagePaths];

        if (allImages.length === 0) {
            allImages = ['https://via.placeholder.com/300'];
        }

        const status = stock > 0 ? 'active' : 'out-of-stock';

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                stock,
                images: allImages,
                status
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
// =========================================================================

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
        
        // TODO: Delete images from 'uploads' folder if necessary

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