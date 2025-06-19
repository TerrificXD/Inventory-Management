import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import API from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Boxes, DollarSign, Layers } from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const categoryData = products.reduce((acc, item) => {
    const found = acc.find((entry) => entry.category === item.category);
    if (found) {
      found.quantity += item.quantity;
    } else {
      acc.push({ category: item.category, quantity: item.quantity });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-600">
        Inventory Dashboard
      </h2>

      {/* Animated Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl flex items-center gap-4"
        >
          <div className="bg-indigo-600 text-white p-3 rounded-full">
            <Boxes size={28} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Products</p>
            <h3 className="text-3xl font-bold text-indigo-700">{totalProducts}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl flex items-center gap-4"
        >
          <div className="bg-green-500 text-white p-3 rounded-full">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Inventory Value</p>
            <h3 className="text-3xl font-bold text-green-600">
              ₹{totalValue.toLocaleString()}
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/30 backdrop-blur-md border border-white/20 shadow-lg p-6 rounded-2xl flex items-center gap-4"
        >
          <div className="bg-pink-500 text-white p-3 rounded-full">
            <Layers size={28} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Categories</p>
            <h3 className="text-3xl font-bold text-pink-600">
              {categoryData.length}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Inventory by Category</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No data to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
