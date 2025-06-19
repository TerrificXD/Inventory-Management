import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 to-blue-800 text-white p-4 space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">InventoryApp</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
          <Link to="/products" className="hover:bg-gray-700 p-2 rounded">Products</Link>
          <Link to="/profile" className="hover:bg-gray-700 p-2 rounded">Profile</Link>

          {/* ✅ Admin-only link */}
          {user?.role === "admin" && (
            <Link to="/users" className="hover:bg-gray-700 p-2 rounded text-yellow-300 font-semibold">
              Manage Users
            </Link>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 p-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Navbar */}
        <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-indigo-700">Welcome, {user?.name}</h1>
          <div className="space-x-4">
            <Link
              to="/profile"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
