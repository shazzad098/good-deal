// server/seed.js (create this file)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const adminExists = await User.findOne({ email: 'good.deal326@gmail.com' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const adminUser = new User({
                name: 'GoodDeal Admin',
                email: 'good.deal326@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
        } else {
            console.log('✅ Admin user already exists');
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdminUser();