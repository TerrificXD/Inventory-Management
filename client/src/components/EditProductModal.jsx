import React, { useEffect, useState } from "react";
import API from "../api/axios";

const EditProductModal = ({ product, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    sku: "",
    lowStockAlert: ""
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        sku: product.sku,
        lowStockAlert: product.lowStockAlert,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${product._id}`, {
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
        lowStockAlert: parseInt(form.lowStockAlert)
      });
      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to update product");
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl relative border border-indigo-100">
        <h2 className="text-2xl font-extrabold text-indigo-700 mb-4">✏️ Edit Product</h2>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Product Name"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Category"
            required
          />
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="SKU (read-only)"
            disabled
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Quantity"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Price"
            required
          />
          <input
            name="lowStockAlert"
            type="number"
            value={form.lowStockAlert}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Low Stock Alert"
            required
          />

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
