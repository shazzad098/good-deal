// server/seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const demoProducts = [
    {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        originalPrice: 129.99,
        category: "electronics",
        brand: "SoundMax",
        stock: 50,
        images: ["/images/headphones.jpg"],
        features: ["Noise Cancellation", "30hr Battery", "Fast Charging"]
    },
    {
        name: "Smartphone X Pro",
        description: "Latest smartphone with advanced camera and processor",
        price: 899.99,
        category: "electronics",
        brand: "TechBrand",
        stock: 25,
        images: ["/images/phone.jpg"],
        features: ["5G", "128GB Storage", "Triple Camera"]
    },
    {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt for everyday wear",
        price: 19.99,
        category: "clothing",
        brand: "FashionWear",
        stock: 100,
        images: ["/images/tshirt.jpg"],
        features: ["100% Cotton", "Machine Wash", "Multiple Colors"]
    },
    {
        name: "Laptop Backpack",
        description: "Durable backpack with laptop compartment and water resistance",
        price: 49.99,
        originalPrice: 69.99,
        category: "electronics",
        brand: "TravelGear",
        stock: 30,
        images: ["/images/backpack.jpg"],
        features: ["Laptop Compartment", "Water Resistant", "Multiple Pockets"]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gooddeal');

        // Clear existing products
        await Product.deleteMany({});

        // Add demo products
        await Product.insertMany(demoProducts);

        console.log('Demo products added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();