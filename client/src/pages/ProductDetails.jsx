import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      alert("Failed to fetch product");
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-600 text-lg">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
        🧾 Product Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span> {product.name}
        </div>
        <div>
          <span className="font-semibold">Category:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">SKU:</span> {product.sku}
        </div>
        <div>
          <span className="font-semibold">Quantity:</span> {product.quantity}
        </div>
        <div>
          <span className="font-semibold">Price:</span> ₹{product.price}
        </div>
        <div>
          <span className="font-semibold">Low Stock Alert:</span> {product.lowStockAlert}
        </div>
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(product.createdAt).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Updated At:</span>{" "}
          {new Date(product.updatedAt).toLocaleString()}
        </div>
      </div>

      <div className="mt-6 text-right">
        <Link
          to="/products"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
        >
          ⬅ Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
