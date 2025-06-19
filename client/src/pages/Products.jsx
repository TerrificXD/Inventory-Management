import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import EditProductModal from "../components/EditProductModal";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    sku: "",
    lowStockAlert: ""
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const getAllProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sku) return alert("SKU is required. It must be unique.");
    try {
      await API.post("/products", {
        ...form,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price),
        lowStockAlert: parseInt(form.lowStockAlert),
      });
      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
        sku: "",
        lowStockAlert: ""
      });
      getAllProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      getAllProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await API.get("/products/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to export CSV");
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/products/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV imported successfully");
      getAllProducts();
    } catch (err) {
      alert("Failed to import CSV");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        📦 Inventory Dashboard
      </h2>

      {user?.role === "admin" && (
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transform transition"
          >
            📤 Export CSV
          </button>
          <label className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer hover:scale-105 transition">
            📥 Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input name="sku" placeholder="SKU (Unique)" value={form.sku} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input name="lowStockAlert" type="number" placeholder="Low Stock Alert" value={form.lowStockAlert} onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <button
          type="submit"
          className="col-span-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          ➕ Add Product
        </button>
      </form>

      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
        <table className="w-full table-auto text-sm">
          <thead className="bg-indigo-200 text-indigo-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Alert</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-indigo-50 transition">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.lowStockAlert}</td>
                  <td className="p-3 space-x-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                    >
                      🔍 View
                    </Link>
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={getAllProducts}
        />
      )}
    </div>
  );
};

export default Products;
