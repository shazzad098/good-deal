const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Samsung Galaxy S23",
        description: "Latest Samsung smartphone with advanced features",
        price: 899.99,
        category: "electronics",
        subcategory: "mobile",
        brand: "Samsung",
        images: ["https://via.placeholder.com/300"],
        stock: 50,
        specifications: {
            "Screen": "6.1 inch",
            "RAM": "8GB",
            "Storage": "128GB",
            "Camera": "50MP"
        },
        features: ["5G", "Fast Charging", "Water Resistant"]
    },
    {
        name: "Nike Air Max",
        description: "Comfortable running shoes",
        price: 129.99,
        category: "clothing",
        subcategory: "shoes",
        brand: "Nike",
        images: ["https://via.placeholder.com/300"],
        stock: 100,
        specifications: {
            "Size": "Available 7-12",
            "Color": "Black/White",
            "Material": "Mesh"
        },
        features: ["Air Cushion", "Breathable", "Lightweight"]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gooddeal');
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Add sample products
        await Product.insertMany(sampleProducts);
        console.log('Sample products added');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();