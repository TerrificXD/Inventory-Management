const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    company: { type: String, required: true }, // From user's company
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    quantity: { type: Number, default: 0 },
    sku: { type: String, unique: true },
    price: { type: Number, required: true },
    lowStockAlert: { type: Number, default: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
