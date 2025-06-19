const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  type: { type: String, enum: ["in", "out"], required: true },
  amount: { type: Number, required: true },
  company: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);
