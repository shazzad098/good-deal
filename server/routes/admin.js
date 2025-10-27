// server/routes/admin.js - TEMPORARY FIX
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
// const auth = require('../middleware/auth'); // Comment out করে রাখুন
// const admin = require("../middleware/admin"); // Comment out করে রাখুন

// GET all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// POST - Create new product
router.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: images || ['https://via.placeholder.com/300']
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Products created successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// PUT - Update product (FIXED)
router.put('/products/:id', async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Products not found'
            });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                stock,
                images: images || product.images
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Products updated successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// DELETE - Delete product (FIXED)
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Products not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Products deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;