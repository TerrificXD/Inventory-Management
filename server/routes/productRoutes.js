const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut,
    lowStockProducts,
    exportProductsToCSV,
    importProductsFromCSV
} = require("../controllers/productController");

router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.put("/stockin/:id", stockIn);
router.put("/stockout/:id", stockOut);
router.get("/low-stock", lowStockProducts);
router.get("/export/csv", exportProductsToCSV);
router.post("/import/csv", upload.single("file"), importProductsFromCSV);



module.exports = router;
