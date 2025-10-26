// middleware/admin.js
const admin = (req, res, next) => {
    // Check if user exists and is admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
};

module.exports = admin;