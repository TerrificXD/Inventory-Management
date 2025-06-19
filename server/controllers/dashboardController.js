const Product = require("../models/Product");

exports.getDashboardStats = async (req, res) => {
    try {
        const company = req.user.company;

        const totalProducts = await Product.countDocuments({ company });

        const products = await Product.find({ company });

        const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

        const lowStockCount = products.filter(
            (p) => p.quantity <= p.lowStockAlert
        ).length;

        res.json({
            totalProducts,
            totalStock,
            lowStockCount,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get dashboard stats" });
    }
};
