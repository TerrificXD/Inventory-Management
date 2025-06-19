const Product = require("../models/Product");
const { Parser } = require("json2csv");
const csv = require("csv-parser");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, quantity, price, sku, lowStockAlert } = req.body;
    const company = req.user.company;

    // Basic validation
    if (!name || !category || !quantity || !price || !sku) {
      return res.status(400).json({ error: "All fields required" });
    }

    const product = await Product.create({
      name,
      brand,
      category,
      quantity,
      price,
      sku,
      company,
      lowStockAlert,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);

    // Handle duplicate SKU error
    if (error.code === 11000 && error.keyPattern?.sku) {
      return res.status(400).json({ error: "SKU must be unique. Duplicate SKU found." });
    }

    res.status(500).json({ error: "Failed to create product" });
  }
};


// Get All Products for Company
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ company: req.user.company });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, company: req.user.company },
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      company: req.user.company
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Stock In
exports.stockIn = async (req, res) => {
  try {
    const { amount } = req.body;

    const product = await Product.findOne({ _id: req.params.id, company: req.user.company });
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.quantity += amount;
    await product.save();

    res.json({ message: "Stock increased", product });
  } catch (error) {
    res.status(500).json({ error: "Stock in failed" });
  }
};

// Stock Out
exports.stockOut = async (req, res) => {
  try {
    const { amount } = req.body;

    const product = await Product.findOne({ _id: req.params.id, company: req.user.company });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.quantity < amount) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    product.quantity -= amount;
    await product.save();

    res.json({ message: "Stock decreased", product });
  } catch (error) {
    res.status(500).json({ error: "Stock out failed" });
  }
};

// Get Low Stock Products
exports.lowStockProducts = async (req, res) => {
  try {
    const lowStock = await Product.find({
      company: req.user.company,
      $expr: { $lte: ["$quantity", "$lowStockAlert"] }
    });


    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
};

// Export to CSV
exports.exportProductsToCSV = async (req, res) => {
  try {
    const products = await Product.find({ company: req.user.company }).select("-__v -company");

    if (!products.length) {
      return res.status(400).json({ error: "No products available to export." });
    }

    // Dynamically use keys to avoid field mismatch
    const fields = Object.keys(products[0]._doc); // safer than hardcoded
    const json2csv = new Parser({ fields });

    const csv = json2csv.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ error: "Failed to export products" });
  }
};

// Import from CSV
exports.importProductsFromCSV = async (req, res) => {
  try {
    const company = req.user.company;

    const results = [];
    const buffer = req.file.buffer;

    buffer
      .toString()
      .split("\n")
      .slice(1)
      .forEach((line) => {
        const [name, brand, category, quantity, price, sku, lowStockAlert] = line.split(",");

        if (name) {
          results.push({
            name: name.trim(),
            brand: brand?.trim(),
            category: category?.trim(),
            quantity: parseInt(quantity),
            price: parseFloat(price),
            sku: sku?.trim(),
            lowStockAlert: parseInt(lowStockAlert),
            company,
          });
        }
      });

    await Product.insertMany(results);
    res.json({ message: "Products imported successfully", count: results.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to import products" });
  }
};